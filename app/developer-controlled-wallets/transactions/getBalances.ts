import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const providerWorldchain = new ethers.JsonRpcProvider(process.env.WORLDCHAIN_RPC_URL);
const providerBase = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);

// const USDC_ADDRESS_BASE_SEPOLIA = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
// const USDC_ADDRESS_WORLDCHAIN_SEPOLIA = "0x66145f38cBAC35Ca6F1Dfb4914dF98F1614aeA88";
const USDC_ADDRESS_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDC_ADDRESS_WORLDCHAIN = ethers.getAddress("0x79a02482a880bce3f13e09da970dc34db4cd24d1");

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

async function getUSDCBalanceBase(walletAddress: string): Promise<string> {
  const usdcContract = new ethers.Contract(USDC_ADDRESS_BASE, ERC20_ABI, providerBase);
  const balanceRaw = await usdcContract.balanceOf(walletAddress);
  const decimals = await usdcContract.decimals();
  const balance = ethers.formatUnits(balanceRaw, decimals);
  console.log(`USDC Balance (Base) of ${walletAddress}: ${balance}`);
  return balance;
}

async function getUSDCBalanceWorldchain(walletAddress: string): Promise<string> {
  const usdcContract = new ethers.Contract(USDC_ADDRESS_WORLDCHAIN, ERC20_ABI, providerWorldchain);
  const balanceRaw = await usdcContract.balanceOf(walletAddress);
  const decimals = await usdcContract.decimals();
  const balance = ethers.formatUnits(balanceRaw, decimals);
  console.log(`USDC Balance (Worldchain) of ${walletAddress}: ${balance}`);
  return balance;
}

// const developerWalletAddress = process.env.DEVELOPER_CONTROLLED_WALLET!;

getUSDCBalanceWorldchain("0x3bF373b219D6CF80738f6e2D26B34Fb46a39b33e").catch(console.error);
getUSDCBalanceBase("0x28a88ef4fa6f6f577af38527c35f4f65fc97bbb2").catch(console.error);