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
const ROUTER_ADDRESS = web3.utils.toChecksumAddress(
  process.env.ROUTER_ADDRESS!
);
const SMART_WALLET_ADDRESS = web3.utils.toChecksumAddress(
  process.env.SMART_WALLET_ADDRESS!
);
const TOKENS_TO_SELL = [
  process.env.BTC_ADDRESS!,
  process.env.WETH_ADDRESS!,
].map((addr) => web3.utils.toChecksumAddress(addr));

import smartWalletAbi from "../dca/abi/SmartWalletAbi.json" assert { type: "json" };
import erc20Abi from "../dca/abi/ERC20Abi.json" assert { type: "json" };

export async function POST(req: NextRequest) {
  try {
    if (!SMART_WALLET_ADDRESS) {
      return NextResponse.json(
        { message: "SMART_WALLET_ADDRESS is not defined in env" },
        { status: 500 }
      );
    }

    const smartWallet = new web3.eth.Contract(
      smartWalletAbi,
      SMART_WALLET_ADDRESS
    );
    const txHashes: string[] = [];
    let nonce = await web3.eth.getTransactionCount(account.address, "pending");

    for (const token of TOKENS_TO_SELL) {
      const erc20 = new web3.eth.Contract(erc20Abi, token);
      const balance = await erc20.methods
        .balanceOf(SMART_WALLET_ADDRESS)
        .call();

     

      console.log(`🔄 Swapping ${token} → USDC | Amount: ${balance}`);

      const tx = smartWallet.methods.performSwapV2(
        ROUTER_ADDRESS,
        token,
        USDC,
        balance,
        0
      );

      const gas = await tx.estimateGas({ from: account.address });
      const gasPrice = await web3.eth.getGasPrice();

      const receipt = await tx.send({
        from: account.address,
        gas: gas.toString(),
        gasPrice: gasPrice.toString(),
        nonce: nonce.toString(),
      });

      txHashes.push(receipt.transactionHash);
      nonce++;
    }

    console.log("💸 Calling withdrawAll on SmartWallet...");

    const withdrawTx = smartWallet.methods.withdrawAll();
    const withdrawGas = await withdrawTx.estimateGas({ from: account.address });
    console.log("💸 Withdraw gas:", withdrawGas);
    const withdrawGasPrice = await web3.eth.getGasPrice();
    console.log("💸 Withdraw gas price:", withdrawGasPrice);
    
    const withdrawReceipt = await withdrawTx.send({
      from: account.address,
      gas: withdrawGas.toString(),
      gasPrice: withdrawGasPrice.toString(),
      nonce: nonce.toString(),
    });

    console.log(
      `✅ Withdraw successful | Tx: ${withdrawReceipt.transactionHash}`
    );
    txHashes.push(withdrawReceipt.transactionHash);

    return NextResponse.json({
      message: "Swaps to USDC completed",
      txHashes,
    });
  } catch (error: any) {
    console.error("❌ Swap execution failed:", error.message);
    return NextResponse.json(
      { message: "Swap failed", error: error.message },
      { status: 500 }
    );
  }
}
