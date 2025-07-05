import { client } from "../client/initClient";

export async function createWalletSet(name: string) {
    const result = await client.createWalletSet({ name });
    return result.data?.walletSet;
}