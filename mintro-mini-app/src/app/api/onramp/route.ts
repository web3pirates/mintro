import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { address, amountUsd } = await req.json();

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // World App Add Money Quick Action parameters
    const appId = "app_e7d27c5ce2234e00558776f227f791ef";
    const path = "/"; // URL-encoded path to the bridge interface
    const toAddress = address;
    const toToken = "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1"; // UDSC token contract address on World Chain
    const sourceAppId = process.env.NEXT_PUBLIC_WLD_CLIENT_ID;
    const sourceAppName = "Mintro"; // Your app name
    const sourceDeeplinkPath = "/home"; // URL-encoded path back to your app

    // Build the World App Add Money URL
    const baseUrl = "https://worldcoin.org/mini-app";
    const params = new URLSearchParams({
      app_id: appId || "",
      path,
      toAddress,
      toToken,
      sourceAppId: sourceAppId || "",
      sourceAppName,
      sourceDeeplinkPath,
    });

    // Add amount if provided
    if (amountUsd) {
      params.append("amountUsd", amountUsd.toString());
    }

    const addMoneyUrl = `${baseUrl}?${params.toString()}`;

    console.log("=== WORLD APP ADD MONEY URL ===");
    console.log("App ID:", appId);
    console.log("To Address:", toAddress);
    console.log("To Token:", toToken);
    console.log("Amount USD:", amountUsd);
    console.log("Full URL:", addMoneyUrl);
    console.log("=== END WORLD APP ADD MONEY URL ===");

    return NextResponse.json({ url: addMoneyUrl });
  } catch (error) {
    console.error("Error creating World App Add Money URL:", error);
    return NextResponse.json(
      { error: "Failed to create add money URL" },
      { status: 500 }
    );
  }
}
