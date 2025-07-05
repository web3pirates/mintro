import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { address, redirectUrl } = await req.json();

  const secretBase64 = process.env.COINBASE_ONRAMP_SECRET;

  if (!secretBase64) {
    return NextResponse.json(
      { error: "COINBASE_ONRAMP_SECRET is not set in environment" },
      { status: 500 }
    );
  }

  // Use the base64 secret directly as a buffer (this is the key fix)
  const secret = Buffer.from(secretBase64, "base64");

  const sessionToken = jwt.sign(
    {
      sub: address,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
    },
    secret,
    { algorithm: "HS256" }
  );

  const baseUrl = "https://pay.coinbase.com/buy";
  const addresses = JSON.stringify({ worldchain: address });
  const params = new URLSearchParams({
    appId: process.env.NEXT_PUBLIC_COINBASE_APP_ID!,
    addresses,
    assets: JSON.stringify(["WLD"]),
    redirectUrl,
    sessionToken,
  });

  console.log("params", params);
  console.log("sessionToken", sessionToken);
  console.log("secret", secret);
  console.log("baseUrl", baseUrl);
  console.log("addresses", addresses);
  console.log("assets", ["WLD"]);
  console.log("appId", process.env.NEXT_PUBLIC_COINBASE_APP_ID);
  console.log("address", address);
  console.log("redirectUrl", redirectUrl);

  const onrampUrl = `${baseUrl}?${params.toString()}`;
  return NextResponse.json({ url: onrampUrl });
}
