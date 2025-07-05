import { client } from "../client/initClient";

export async function createWallet(walletSetId: string, count = 1) {
    const res = await client.createWallets({
        accountType: 'SCA',
        blockchains: ['BASE'],
        count,
        walletSetId,
    });
    return res.data?.wallets;
}