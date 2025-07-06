import dotenv from "dotenv";
import Web3 from "web3";
import { MongoClient } from "mongodb";
import routerAbi from "./abi/UniswapV2Router02.json" assert { type: "json" };
import smartWalletAbi from "./abi/SmartWalletAbi.json"

dotenv.config();

// Init Web3
const web3 = new Web3(process.env.WORLDCHAIN_RPC_URL);
const account = web3.eth.accounts.privateKeyToAccount(
  process.env.OPERATOR_PRIVATE_KEY
);
web3.eth.accounts.wallet.add(account);

// Setup MongoDB
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("mintro-db");
const trades = db.collection("transactions");

// Token addresses (with fallbacks)
const toChecksum = (address) => {
  if (!web3) return address;
  return web3.utils.toChecksumAddress(address);
};

const USDC = toChecksum(process.env.USDC_ADDRESS || "0xA0b86a33E6441b8c4c8c8c8c8c8c8c8c8c8c8c8c");
const WLD = toChecksum(process.env.WLD_ADDRESS || "0x163f8C2617924dF6b0D1a3fA8c2A3C2C3C3C3C3C3C");
const BTC = toChecksum(process.env.BTC_ADDRESS || "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599");
const WETH = toChecksum(process.env.WETH_ADDRESS || "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");

// === Investment structure ===
const institutionalTokens = {
  [BTC]: 40,
  [WLD]: 30,
  [WETH]: 30,
};



// Router config
const router = new web3.eth.Contract(routerAbi, process.env.ROUTER_ADDRESS);

// Amount to allocate
const amountPerMonth = parseFloat(process.env.AMOUNT_PER_MONTH) || 1000;
const amountInstitutional = amountPerMonth * 0.7;


// ======= TRADE FUNCTION =======
async function tradeUSDCtoToken(
  tokenAddress,
  amountInUSDC,
  userSmartWalletAddress,
  nonce
) {
  const amountIn = web3.utils.toWei(amountInUSDC.toString(), "mwei"); // USDC = 6 decimals
  const amountOutMin = 0;

  const smartWallet = new web3.eth.Contract(
    smartWalletAbi,
    userSmartWalletAddress
  );

  console.log("\n========== 🚀 Executing performSwapV2 ==========");
  console.log("→ SmartWallet:", userSmartWalletAddress);
  console.log("→ Router:", router.options.address);
  console.log("→ Token In (USDC):", USDC);
  console.log("→ Token Out:", tokenAddress);
  console.log("→ Amount In (wei):", amountIn);
  console.log("→ Amount Out Min:", amountOutMin);
  console.log("→ Nonce:", nonce);
  console.log("===============================================\n");

  // Only try to load ABI files if we have blockchain config
  try {
    const smartWallet = new web3.eth.Contract(smartWalletAbi, userSmartWalletAddress);

    const amountIn = web3.utils.toWei(amountInUSDC.toString(), "mwei"); // USDC = 6 decimals
    const amountOutMin = 0;

    console.log("\n========== 🚀 Executing performSwapV2 ==========");
    console.log("→ SmartWallet:", userSmartWalletAddress);
    console.log("→ Router:", router?.options?.address || "Not configured");
    console.log("→ Token In (USDC):", USDC);
    console.log("→ Token Out:", tokenAddress);
    console.log("→ Amount In (wei):", amountIn);
    console.log("→ Amount Out Min:", amountOutMin);
    console.log("→ Nonce:", nonce);
    console.log("===============================================\n");

    const tx = smartWallet.methods.performSwapV2(
      router?.options?.address || USDC, // Fallback if router not configured
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
      nonce,
    });

    console.log(
      `✅ Traded ${amountInUSDC} USDC → ${tokenAddress} via SmartWallet | Tx: ${receipt.transactionHash}`
    );

    await trades.insertOne({
      token: tokenAddress,
      amount_usdc: amountInUSDC,
      tx_hash: receipt.transactionHash,
      smart_wallet: userSmartWalletAddress,
      timestamp: new Date(),
    });

    return Number(nonce) + 1;
  } catch (error) {
    console.error("❌ ERROR in tradeUSDCtoToken:");
    console.error("🔍 Message:", error.message);
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error("📁 ABI file not found. Please ensure ./abi/SmartWalletAbi.json exists");
    }
    console.error("🧾 Full error:", error);
    throw error;
  }
}

// ======= EXECUTE FOR CATEGORY =======
async function executeCategory(
  name,
  totalAmount,
  tokenMap,
  smartWalletAddress
) {
  console.log(`\n🪙 Executing ${name.toUpperCase()} DCA...`);
  const totalPerc = Object.values(tokenMap).reduce((sum, p) => sum + p, 0);
  
  let nonce = 0;
  nonce = await web3.eth.getTransactionCount(account.address, "pending");

  for (const [token, perc] of Object.entries(tokenMap)) {
    const share = perc / totalPerc;
    const amount = totalAmount * share;
    nonce = await tradeUSDCtoToken(token, amount, smartWalletAddress, nonce);
  }
}

// ======= MAIN FUNCTION =======
export async function executeDCA() {
  console.log("📈 Executing monthly DCA strategy...");
  
  await client.connect();

  const smartWalletAddress = process.env.SMART_WALLET_ADDRESS || "0x1234567890123456789012345678901234567890";
  
  

  await executeCategory(
    "institutional",
    amountInstitutional,
    institutionalTokens,
    smartWalletAddress
  );
  // await executeCategory("memecoin", amountMemecoin, memecoinTokens, smartWalletAddress);

  await client.close();
  
  console.log("✅ DCA execution completed successfully!");
}



