import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);

const USDC_ADDRESS_BASE_SEPOLIA = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
const USDC_ADDRESS_WORLDCHAIN_SEPOLIA = "0x66145f38cBAC35Ca6F1Dfb4914dF98F1614aeA88";

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

async function getUSDCBalanceBaseSepolia(walletAddress: string): Promise<string> {
  const usdcContract = new ethers.Contract(USDC_ADDRESS_BASE_SEPOLIA, ERC20_ABI, provider);
  const balanceRaw = await usdcContract.balanceOf(walletAddress);
  const decimals = await usdcContract.decimals();
  const balance = ethers.formatUnits(balanceRaw, decimals);
  console.log(`USDC Balance (Base Sepolia) of ${walletAddress}: ${balance}`);
  return balance;
}

async function getUSDCBalanceWorldchainSepolia(walletAddress: string): Promise<string> {
  const usdcContract = new ethers.Contract(USDC_ADDRESS_WORLDCHAIN_SEPOLIA, ERC20_ABI, provider);
  const balanceRaw = await usdcContract.balanceOf(walletAddress);
  const decimals = await usdcContract.decimals();
  const balance = ethers.formatUnits(balanceRaw, decimals);
  console.log(`USDC Balance (Worldchain Sepolia) of ${walletAddress}: ${balance}`);
  return balance;
}

const developerWalletAddress = process.env.DEVELOPER_CONTROLLED_WALLET!;

getUSDCBalanceBaseSepolia(developerWalletAddress).catch(console.error);
getUSDCBalanceWorldchainSepolia(developerWalletAddress).catch(console.error);