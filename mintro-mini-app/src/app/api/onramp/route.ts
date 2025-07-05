import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { address, redirectUrl } = await req.json();

  const baseUrl = "https://pay.coinbase.com/buy";
  const params = new URLSearchParams({
    appId: process.env.COINBASE_ONRAMP_PUBLIC_KEY!,
    destinationWallets: JSON.stringify([
      { address, blockchains: ["ethereum"] },
    ]),
    redirectUrl,
  });

  const onrampUrl = `${baseUrl}?${params.toString()}`;
  return NextResponse.json({ url: onrampUrl });
}
