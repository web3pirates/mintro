import { burnUSDC } from "../client/cctpClient";

export async function crossChainBurn({
    sourceDomainId,
    walletId,
    tokenId,
    amount,
    destinationDomainId,
}: {
    sourceDomainId: number;
    walletId: string;
    tokenId: string;
    amount: string;
    destinationDomainId: number;
}) {
    const burnResponse = await burnUSDC({
        sourceDomainId,
        walletId,
        tokenId,
        amount,
        destinationDomainId,
    });
    return burnResponse;
}