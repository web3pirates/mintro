import { burnUSDC, getAttestations, mintUSDC } from "../client/cctpClient";

type CrossChainTransferParams = {
  sourceDomainId: number;
  destinationDomainId: number;
  walletId: string;
  tokenId: string;
  amount: string;
  destinationAddress: string;
  pollIntervalMs?: number;
  pollTimeoutMs?: number;
};

export async function crossChainTransfer({
  sourceDomainId,
  destinationDomainId,
  walletId,
  tokenId,
  amount,
  destinationAddress,
  pollIntervalMs = 5000,
  pollTimeoutMs = 60000,
}: CrossChainTransferParams) {
  try {
    const burnResponse = await burnUSDC({
      sourceDomainId,
      walletId,
      tokenId,
      amount,
      destinationDomainId,
    });
    const attestationId = burnResponse.attestationId;
    if (!attestationId) {
      throw new Error("Attestation ID missing in burn response");
    }
    console.log("Burn executed, attestationId:", attestationId);

    const deadline = Date.now() + pollIntervalMs;

    while (Date.now() < deadline) {
      const messages = await getAttestations(sourceDomainId);
      const attestation = messages.find(
        (msg: any) =>
          msg.attestationId === attestationId && msg.status === "CONFIRMED"
      );
      if (attestation) {
        console.log("Attestation confirmed.");
        const mintResponse = await mintUSDC({
          attestationId,
          destinationDomainId,
          destinationAddress,
        });
        console.log("Mint executed:", mintResponse);
        return mintResponse;
      }
      console.log("Waiting for attestation... retry in", pollIntervalMs, "ms");
      await new Promise((r) => setTimeout(r, pollIntervalMs));
    }

    throw new Error("Timeout: attestation not confirmed within time limit");
  } catch (error) {
    console.error("Cross-chain transfer error:", error);
    throw error;
  }
}
