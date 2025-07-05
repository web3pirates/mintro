import { client } from "../client/initClient";

(async () => {
  const tokens = await client.getTokens();

  tokens.data?.tokens?.forEach((token) => {
    if (token.symbol === "USDC") {
      console.log(`USDC on ${token.blockchain}:`);
      console.log(`→ tokenId: ${token.id}`);
      console.log(`→ tokenAddress: ${token.tokenAddress}`);
      console.log("---");
    }
  });
})();
