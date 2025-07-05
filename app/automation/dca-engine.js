require("dotenv").config();
const Web3 = require("web3");
const { MongoClient } = require("mongodb");
const cron = require("node-cron");

// Init web3
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WORLDCHAIN_RPC_URL));
const account = web3.eth.accounts.privateKeyToAccount(process.env.OPERATOR_PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

// Setup Mongo
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("mintro-db");
const trades = db.collection("transactions");

// Token addresses
const USDC = process.env.USDC_ADDRESS;

// === Investment structure ===

// Institutional (70%)
const institutionalTokens = {
  [process.env.BTC_ADDRESS]: 40, // BTC
  [process.env.SOL_ADDRESS]: 30, // SOL
  [process.env.WLD_ADDRESS]: 30, // WLD
};

// Memecoin (30%)
const memecoinTokens = {
  [process.env.XRP_ADDRESS]: 50, // XRP
  [process.env.DOGE_ADDRESS]: 30, // DOGE
  [process.env.SUI_ADDRESS]: 20, // SUI
};

// Router config
const routerAbi = require("./abi/UniswapV2Router02.json");
const router = new web3.eth.Contract(routerAbi, process.env.ROUTER_ADDRESS);

// Amount to allocate
const amountPerMonth = parseFloat(process.env.AMOUNT_PER_MONTH);
const amountInstitutional = amountPerMonth * 0.7;
const amountMemecoin = amountPerMonth * 0.3;

// ============ TRADE FUNCTION ============
async function tradeUSDCtoToken(tokenAddress, amountInUSDC) {
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
  const amountIn = web3.utils.toWei(amountInUSDC.toString(), "mwei");
  const path = [USDC, tokenAddress];

  const tx = router.methods.swapExactTokensForTokens(
    amountIn, 0, path, account.address, deadline
  );

  const gas = await tx.estimateGas({ from: account.address });
  const gasPrice = await web3.eth.getGasPrice();
  const receipt = await web3.eth.sendTransaction({
    from: account.address,
    to: router.options.address,
    data: tx.encodeABI(),
    gas,
    gasPrice,
  });

  console.log(`✅ Traded ${amountInUSDC} USDC → ${tokenAddress} | Tx: ${receipt.transactionHash}`);

  await trades.insertOne({
    token: tokenAddress,
    amount_usdc: amountInUSDC,
    tx_hash: receipt.transactionHash,
    timestamp: new Date(),
  });
}

// ============ EXECUTE FOR CATEGORY ============
async function executeCategory(name, totalAmount, tokenMap) {
  console.log(`🪙 Executing ${name.toUpperCase()} DCA...`);
  const totalPerc = Object.values(tokenMap).reduce((sum, p) => sum + p, 0);

  for (const [token, perc] of Object.entries(tokenMap)) {
    const share = perc / totalPerc;
    const amount = totalAmount * share;
    await tradeUSDCtoToken(token, amount);
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
