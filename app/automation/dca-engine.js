require("dotenv").config();
const Web3 = require("web3").default || require("web3");
const { MongoClient } = require("mongodb");
const cron = require("node-cron");

// Init Web3
const web3 = new Web3(process.env.WORLDCHAIN_RPC_URL);
const account = web3.eth.accounts.privateKeyToAccount(process.env.OPERATOR_PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

// Setup MongoDB
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("mintro-db");
const trades = db.collection("transactions");

// Token addresses
const toChecksum = web3.utils.toChecksumAddress;
const USDC = toChecksum(process.env.USDC_ADDRESS);
const WLD = toChecksum(process.env.WLD_ADDRESS);
const BTC = toChecksum(process.env.BTC_ADDRESS);
const SOL = toChecksum(process.env.SOL_ADDRESS);
const XRP = toChecksum(process.env.XRP_ADDRESS);
const DOGE = toChecksum(process.env.DOGE_ADDRESS);
const SUI = toChecksum(process.env.SUI_ADDRESS);
const WETH = toChecksum(process.env.WETH_ADDRESS);

// === Investment structure ===
const institutionalTokens = {
  [BTC]: 40,
  [WLD]: 30,
  [WETH]: 30,
};

const memecoinTokens = {
  [SUI]: 20,
};

// Router config
const routerAbi = require("./abi/UniswapV2Router02.json");
const router = new web3.eth.Contract(routerAbi, process.env.ROUTER_ADDRESS);

// Amount to allocate
const amountPerMonth = parseFloat(process.env.AMOUNT_PER_MONTH);
const amountInstitutional = amountPerMonth * 0.7;
const amountMemecoin = amountPerMonth * 0.3;

// ======= TRADE FUNCTION =======
async function tradeUSDCtoToken(tokenAddress, amountInUSDC, userSmartWalletAddress, nonce) {
  const amountIn = web3.utils.toWei(amountInUSDC.toString(), "mwei"); // USDC = 6 decimals
  const amountOutMin = 0;

  const smartWalletAbi = require("./abi/SmartWalletAbi.json");
  const smartWallet = new web3.eth.Contract(smartWalletAbi, userSmartWalletAddress);

  console.log("\n========== 🚀 Executing performSwapV2 ==========");
  console.log("→ SmartWallet:", userSmartWalletAddress);
  console.log("→ Router:", router.options.address);
  console.log("→ Token In (USDC):", USDC);
  console.log("→ Token Out:", tokenAddress);
  console.log("→ Amount In (wei):", amountIn);
  console.log("→ Amount Out Min:", amountOutMin);
  console.log("→ Nonce:", nonce);
  console.log("===============================================\n");

  try {
    const tx = smartWallet.methods.performSwapV2(
      router.options.address,
      USDC,
      tokenAddress,
      amountIn,
      amountOutMin
    );

    const gas = await tx.estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();

    const receipt = await tx.send({
      from: account.address,
      gas,
      gasPrice,
      nonce
    });

    console.log(`✅ Traded ${amountInUSDC} USDC → ${tokenAddress} via SmartWallet | Tx: ${receipt.transactionHash}`);

    await trades.insertOne({
      token: tokenAddress,
      amount_usdc: amountInUSDC,
      tx_hash: receipt.transactionHash,
      smart_wallet: userSmartWalletAddress,
      timestamp: new Date(),
    });

    return Number(nonce) + 1;
  } catch (error) {
    console.error("❌ ERROR calling performSwapV2:");
    console.error("🔍 Message:", error.message);
    console.error("🧾 Full error:", error);
    throw error;
  }
}

// ======= EXECUTE FOR CATEGORY =======
async function executeCategory(name, totalAmount, tokenMap, smartWalletAddress) {
  console.log(`\n🪙 Executing ${name.toUpperCase()} DCA...`);
  const totalPerc = Object.values(tokenMap).reduce((sum, p) => sum + p, 0);
  let nonce = await web3.eth.getTransactionCount(account.address, "pending");

  for (const [token, perc] of Object.entries(tokenMap)) {
    const share = perc / totalPerc;
    const amount = totalAmount * share;
    nonce = await tradeUSDCtoToken(token, amount, smartWalletAddress, nonce);
  }
}

// ======= MAIN FUNCTION =======
async function executeDCA() {
  console.log("📈 Executing monthly DCA strategy...");
  await client.connect();

  const smartWalletAddress = process.env.SMART_WALLET_ADDRESS;
  if (!smartWalletAddress) {
    console.error("❌ SMART_WALLET_ADDRESS is not set in .env");
    process.exit(1);
  }

  await executeCategory("institutional", amountInstitutional, institutionalTokens, smartWalletAddress);
  // await executeCategory("memecoin", amountMemecoin, memecoinTokens, smartWalletAddress);

  await client.close();
}

// ======= CRON JOB =======
cron.schedule("0 10 1 * *", () => {
  executeDCA().catch(console.error);
});

console.log("🚀 DCA bot is running...");

// Run immediately for test
executeDCA().catch(console.error);
