import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { address, redirectUrl } = await req.json();

  const baseUrl = "https://pay.coinbase.com/buy";
  const params = new URLSearchParams({
    appId: process.env.COINBASE_ONRAMP_APP_ID!, // Updated env var name
    // New Coinbase Onramp parameters
    addresses: JSON.stringify({ worldchain: address }),
    assets: JSON.stringify(["WLD"]),
    redirectUrl,
  });

  const onrampUrl = `${baseUrl}?${params.toString()}`;
  return NextResponse.json({ url: onrampUrl });
}
