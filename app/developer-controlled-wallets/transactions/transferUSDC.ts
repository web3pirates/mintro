import dotenv from "dotenv";
dotenv.config();

import { crossChainTransfer } from "./crossChainTransfer";

(async () => {
  const result = await crossChainTransfer({
    sourceDomainId: 8453,
    destinationDomainId: 480,
    walletId: process.env.WALLET_ID!,
    tokenId: process.env.USDC_TOKEN_ID!,
    amount: process.argv[2] || "1.0", // es: `npx tsx transferUSDC.ts 5.5`
    destinationAddress: process.env.DESTINATION_ADDRESS!,
  });


  console.log("✅ Transfer completed:", result);
})();