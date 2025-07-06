import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Web3 from "web3";
import * as dotenv from "dotenv";

dotenv.config();

const web3 = new Web3(process.env.WORLDCHAIN_RPC_URL!);
const account = web3.eth.accounts.privateKeyToAccount(
  process.env.OPERATOR_PRIVATE_KEY!
);
web3.eth.accounts.wallet.add(account);

const USDC = web3.utils.toChecksumAddress(process.env.USDC_ADDRESS!);
const WLD = web3.utils.toChecksumAddress(process.env.WLD_ADDRESS!);

import positionManagerAbi from "./abi/NonfungiblePositionManagerAbi.json" assert { type: "json" };

const positionManagerAddress = "0xec12a9F9a09f50550686363766Cc153D03c27b5e";
const positionManager = new web3.eth.Contract(
  positionManagerAbi,
  positionManagerAddress
);

import erc20Abi from "./abi/ERC20Abi.json" assert { type: "json" };

export async function POST(req: NextRequest) {
  console.log("🚀 Starting liquidity providing process...");
  
  try {
    const { userAddress} = await req.json();
    console.log("📥 Received request with userAddress:", userAddress);

    const amountUSDC = 0.01 * 10 ** 6;
    const amountWLD = 0.01 * 10 ** 18;
    console.log("💰 Amounts to provide - USDC:", amountUSDC, "WLD:", amountWLD);

    if (!web3.utils.isAddress(userAddress)) {
      console.log("❌ Invalid userAddress provided:", userAddress);
      return NextResponse.json(
        { message: "Invalid userAddress" },
        { status: 400 }
      );
    }
    console.log("✅ UserAddress validation passed");

    if (!amountUSDC || !amountWLD) {
      console.log("❌ Missing amounts - USDC:", amountUSDC, "WLD:", amountWLD);
      return NextResponse.json(
        { message: "Missing amountUSDC or amountWLD" },
        { status: 400 }
      );
    }
   

    // Mint position full range: tickLower, tickUpper max range for Uniswap V3
    console.log("🏗️ Starting position minting process...");
    const tickLower = -887220;
    const tickUpper = 887220;
    const fee = 3000; // 0.3%
    console.log("📊 Position parameters - tickLower:", tickLower, "tickUpper:", tickUpper, "fee:", fee);

    const [token0, token1] =
      USDC.toLowerCase() < WLD.toLowerCase() ? [USDC, WLD] : [WLD, USDC];
    console.log("🔄 Token ordering - token0:", token0, "token1:", token1);

    const mintParams = {
      token0,
      token1,
      fee,
      tickLower,
      tickUpper,
      amount0Desired: token0 === USDC ? amountUSDC : amountWLD,
      amount1Desired: token1 === WLD ? amountWLD : amountUSDC,
      amount0Min: 0,
      amount1Min: 0,
      recipient: userAddress,
      deadline: Math.floor(Date.now() / 1000) + 60 * 10,
    };
    console.log("📋 Mint parameters:", JSON.stringify(mintParams, null, 2));

    const mintTx = positionManager.methods.mint(mintParams);
    console.log("🔧 Mint transaction object created");

    console.log("⛽ Estimating gas for mint transaction...");
    const gasMint = await mintTx.estimateGas({ from: account.address });
    console.log("⛽ Mint gas estimate:", gasMint.toString());
    
    const gasPrice = await web3.eth.getGasPrice();
    console.log("⛽ Gas price:", gasPrice.toString());
    
    const nonce = await web3.eth.getTransactionCount(
      account.address,
      "pending"
    );
    console.log("🔢 Transaction nonce:", nonce.toString());

    console.log("📤 Sending mint transaction...");
    const receipt = await mintTx.send({
      from: account.address,
      gas: gasMint.toString(),
      gasPrice: gasPrice.toString(),
      nonce: nonce.toString(),
    });
    console.log("✅ Mint transaction successful!");


    const tokenId = receipt.events?.IncreaseLiquidity?.returnValues?.tokenId ?? null;
    console.log("🆔 Minted token ID:", tokenId);

    console.log("🎉 Liquidity providing process completed successfully");
    return NextResponse.json({
      message: "Liquidity position minted successfully",
    });
  } catch (error: any) {
    console.error("❌ Minting failed:", error.message);
    console.error("🔍 Error details:", error);
    console.error("📚 Error stack:", error.stack);
    return NextResponse.json(
      { message: "Minting failed", error: error.message },
      { status: 500 }
    );
  }
}
