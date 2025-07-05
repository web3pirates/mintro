require("dotenv").config();
const Web3 = require("web3").default || require("web3");
const { MongoClient } = require("mongodb");
const cron = require("node-cron");

// Init web3
const web3 = new Web3(process.env.WORLDCHAIN_RPC_URL);
const account = web3.eth.accounts.privateKeyToAccount(process.env.OPERATOR_PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

// Setup Mongo
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("mintro-db");
const trades = db.collection("transactions");

// Token addresses - converti in checksum
const USDC = web3.utils.toChecksumAddress(process.env.USDC_ADDRESS);
const WLD = web3.utils.toChecksumAddress(process.env.WLD_ADDRESS);
const BTC = web3.utils.toChecksumAddress(process.env.BTC_ADDRESS);
const SOL = web3.utils.toChecksumAddress(process.env.SOL_ADDRESS);

const XRP = web3.utils.toChecksumAddress(process.env.XRP_ADDRESS);
const DOGE = web3.utils.toChecksumAddress(process.env.DOGE_ADDRESS);
const SUI = web3.utils.toChecksumAddress(process.env.SUI_ADDRESS);

// === Investment structure ===

const institutionalTokens = {
  [BTC]: 40,
  [SOL]: 30,
  [WLD]: 30,
};

const memecoinTokens = {
  [XRP]: 50,
  [DOGE]: 30,
  [SUI]: 20,
};

// Router config
const routerAbi = require("./abi/UniswapV2Router02.json");
const router = new web3.eth.Contract(routerAbi, process.env.ROUTER_ADDRESS);

// Amount to allocate
const amountPerMonth = parseFloat(process.env.AMOUNT_PER_MONTH);
const amountInstitutional = amountPerMonth * 0.7;
const amountMemecoin = amountPerMonth * 0.3;

// Minimal ERC20 ABI for approve & allowance
const ERC20_ABI = [
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "remaining", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "success", type: "bool" }],
    type: "function",
  },
];

// ============ TRADE FUNCTION ============
async function tradeUSDCtoToken(tokenAddress, amountInUSDC, nonce) {
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
  const amountIn = web3.utils.toWei(amountInUSDC.toString(), "mwei"); // USDC has 6 decimals
  const path = [USDC, tokenAddress];

  // 1) Check allowance for router on USDC
  const usdcContract = new web3.eth.Contract(ERC20_ABI, USDC);
  const allowance = await usdcContract.methods.allowance(account.address, router.options.address).call();

  if (BigInt(allowance) < BigInt(amountIn)) {
    console.log(`Approving router to spend ${amountInUSDC} USDC...`);

    const approveTx = usdcContract.methods.approve(router.options.address, amountIn);
    const gasApprove = await approveTx.estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();

    // Qui anche mettiamo nonce per la tx di approve
    const approveReceipt = await approveTx.send({ from: account.address, gas: gasApprove, gasPrice, nonce });
    console.log(`✅ Approval tx hash: ${approveReceipt.transactionHash}`);

    nonce++; // incrementa nonce per la tx successiva
  } else {
    console.log("Router already approved to spend sufficient USDC.");
  }

  // 2) Execute the swap
  const tx = router.methods.swapExactTokensForTokens(
    amountIn,
    0, // min amount out (slippage control to add later)
    path,
    account.address,
    deadline
  );

  const gas = await tx.estimateGas({ from: account.address });
  const gasPrice = await web3.eth.getGasPrice();

  const receipt = await tx.send({ from: account.address, gas, gasPrice, nonce });

  console.log(`✅ Traded ${amountInUSDC} USDC → ${tokenAddress} | Tx: ${receipt.transactionHash}`);

  await trades.insertOne({
    token: tokenAddress,
    amount_usdc: amountInUSDC,
    tx_hash: receipt.transactionHash,
    timestamp: new Date(),
  });

  return Number(nonce) + 1;
}

// ============ EXECUTE FOR CATEGORY ============
async function executeCategory(name, totalAmount, tokenMap) {
  console.log(`🪙 Executing ${name.toUpperCase()} DCA...`);
  const totalPerc = Object.values(tokenMap).reduce((sum, p) => sum + p, 0);

  // Recupero nonce iniziale
  let nonce = await web3.eth.getTransactionCount(account.address, 'pending');

  for (const [token, perc] of Object.entries(tokenMap)) {
    const share = perc / totalPerc;
    const amount = totalAmount * share;
    nonce = await tradeUSDCtoToken(token, amount, nonce);
  }
}

// ============ MAIN FUNCTION ============
async function executeDCA() {
  console.log("📈 Executing monthly DCA strategy...");
  await client.connect();

  await executeCategory("institutional", amountInstitutional, institutionalTokens);
  await executeCategory("memecoin", amountMemecoin, memecoinTokens);

  await client.close();
}

// ============ CRON SCHEDULE ============
cron.schedule("0 10 1 * *", () => {
  executeDCA().catch(console.error);
});

console.log("🚀 DCA bot is running...");

// Avvia subito per test
executeDCA().catch(console.error);
