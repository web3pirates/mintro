import { client } from "../client/initClient";

export async function sendTransaction({walletId, to, amount, tokenId}: {
    walletId: string;
    to: string;
    amount: string;
    tokenId: string;
}) {
    const tx = await client.createTransaction({
        walletId,
        destinationAddress: to,
        amount: [amount],
        tokenId,
        fee: { type: 'level', config: { feeLevel: 'HIGH' } },
    });
    return tx.data;
}