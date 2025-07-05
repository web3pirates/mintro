import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function listTokens() {
  try {
    const response = await axios.get("https://api.circle.com/v1/tokens", {
      headers: {
        Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
      },
    });

    const tokens = response.data.data.tokens;

    tokens.forEach((token: any) => {
      if (token.symbol === "USDC") {
        console.log(`USDC on ${token.blockchain}`);
        console.log(`→ tokenId: ${token.id}`);
        console.log(`→ tokenAddress: ${token.tokenAddress}`);
        console.log("---");
      }
    });
  } catch (error) {
    console.error("Errore nella chiamata API:", error);
  }
}

listTokens();
