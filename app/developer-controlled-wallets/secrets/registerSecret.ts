import { registerEntitySecretCiphertext } from "@circle-fin/developer-controlled-wallets";
import dotenv from "dotenv";
import * as fs from "fs";
dotenv.config();

export async function registerSecret(apiKey: string, entitySecret: string) {
  const response = await registerEntitySecretCiphertext({
    apiKey,
    entitySecret,
  });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.writeFileSync(
    `backups/recovery-${timestamp}.json`,
    JSON.stringify(response.data?.recoveryFile ?? {}, null, 2)
  );
}

const apiKey = process.env.CIRCLE_API_KEY!;
const entitySecret = process.env.CIRCLE_ENTITY_SECRET!;

if (!apiKey || !entitySecret) {
  console.error("Missing api key or entity secret.");
  process.exit(1);
}

registerSecret(apiKey, entitySecret);
