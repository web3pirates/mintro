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
  try {
    const { userAddress, amountUSDC, amountWLD } = await req.json();

    if (!web3.utils.isAddress(userAddress)) {
      return NextResponse.json(
        { message: "Invalid userAddress" },
        { status: 400 }
      );
    }

    if (!amountUSDC || !amountWLD) {
      return NextResponse.json(
        { message: "Missing amountUSDC or amountWLD" },
        { status: 400 }
      );
    }

    // Approve USDC
    const usdcContract = new web3.eth.Contract(erc20Abi, USDC);
    const allowanceUSDC = await usdcContract.methods
      .allowance(userAddress, positionManagerAddress)
      .call();
    if (BigInt(allowanceUSDC) < BigInt(amountUSDC)) {
      const approveTxUSDC = usdcContract.methods.approve(
        positionManagerAddress,
        amountUSDC
      );
      const gasUSDC = await approveTxUSDC.estimateGas({
        from: account.address,
      });
      const gasPrice = await web3.eth.getGasPrice();
      await approveTxUSDC.send({
        from: account.address,
        gas: gasUSDC,
        gasPrice,
      });
    }

    // Approve WLD
    const wldContract = new web3.eth.Contract(erc20Abi, WLD);
    const allowanceWLD = await wldContract.methods
      .allowance(userAddress, positionManagerAddress)
      .call();
    if (BigInt(allowanceWLD) < BigInt(amountWLD)) {
      const approveTxWLD = wldContract.methods.approve(
        positionManagerAddress,
        amountWLD
      );
      const gasWLD = await approveTxWLD.estimateGas({ from: account.address });
      const gasPrice = await web3.eth.getGasPrice();
      await approveTxWLD.send({ from: account.address, gas: gasWLD, gasPrice });
    }

    // Mint position full range: tickLower, tickUpper max range for Uniswap V3
    const tickLower = -887220;
    const tickUpper = 887220;
    const fee = 3000; // 0.3%

    const [token0, token1] =
      USDC.toLowerCase() < WLD.toLowerCase() ? [USDC, WLD] : [WLD, USDC];

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

    const mintTx = positionManager.methods.mint(mintParams);

    const gasMint = await mintTx.estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(
      account.address,
      "pending"
    );

    const receipt = await mintTx.send({
      from: account.address,
      gas: gasMint,
      gasPrice,
      nonce,
    });

    return NextResponse.json({
      message: "Liquidity position minted successfully",
      txHash: receipt.transactionHash,
      tokenId: receipt.events?.IncreaseLiquidity?.returnValues?.tokenId ?? null,
    });
  } catch (error: any) {
    console.error("❌ Minting failed:", error.message);
    return NextResponse.json(
      { message: "Minting failed", error: error.message },
      { status: 500 }
    );
  }
}
