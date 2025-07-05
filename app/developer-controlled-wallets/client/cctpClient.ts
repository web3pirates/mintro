import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const ENV = process.env.NODE_ENV || "development"
const API_KEY = process.env.CIRCLE_API_KEY!;

const HOSTS = {
    testnet: "https://iris-api-sandbox.circle.com",
    mainnet: "https://iris-api.circle.com",
};

const BASE_URL = ENV === "production" ? HOSTS.mainnet : HOSTS.testnet;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
    },
});

export async function burnUSDC(params: {
    sourceDomainId: number;
    walletId: string;
    tokenId: string;
    amount: string;
    destinationDomainId: number;
}) {
    const response = await axiosInstance.post(`/v2/burn/USDC`, params);
    return response.data;
}

export async function mintUSDC(params: {
    attestationId: string;
    destinationDomainId: number;
    destinationAddress: string;
}) {
    const response = await axiosInstance.post(`/v2/mint`, params);
    return response.data;
}

export async function getAttestations(sourceDomainId: number) {
    const response = await axiosInstance.get(`/v2/messages/${sourceDomainId}`);
    return response.data;
}

export async function checkFastBurnAllowance(
    sourceDomainId: number,
    destinationDomainId: number
) {
    const response = await axiosInstance.get(`/v2/fastBurn/USDC/allowance`, {
        params: { sourceDomainId, destinationDomainId },
    });
    return response.data;
}

export async function getBurnFees(
    sourceDomainId: number,
    destinationDomainId: number
) {
    const response = await axiosInstance.get(
        `/v2/burn/USDC/fees/${sourceDomainId}/${destinationDomainId}`
    );
    return response.data;
}