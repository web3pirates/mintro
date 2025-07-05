import { mintUSDC } from "../client/cctpClient";

export async function crossChainMint({
    attestationId,
    destinationDomainId,
    destinationAddress,
}: {
    attestationId: string;
    destinationDomainId: number;
    destinationAddress: string;
}) {
    const mintResponse = await mintUSDC({
        attestationId,
        destinationDomainId,
        destinationAddress,
    });
    return mintResponse;
}