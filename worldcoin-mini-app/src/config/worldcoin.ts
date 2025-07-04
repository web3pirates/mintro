// WorldCoin Mini App Configuration
export const WORLDCOIN_CONFIG = {
  // Replace with your actual WorldCoin App ID from https://developer.worldcoin.org
  APP_ID:
    process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || "app_staging_1234567890abcdef",

  // Action name for verification
  ACTION: "verify_user",

  // Signal for the verification
  SIGNAL: "user_value",

  // Verification level (orb, device, or orb_beta)
  VERIFICATION_LEVEL: "orb" as const,

  // WalletConnect Project ID (optional)
  WALLET_CONNECT_PROJECT_ID:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
    "your_wallet_connect_project_id",
};

// Environment configuration
export const ENV_CONFIG = {
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
};

// API endpoints (for backend integration)
export const API_ENDPOINTS = {
  VERIFY_PROOF: "/api/verify-proof",
  GET_USER_STATUS: "/api/user-status",
};

// Mini App specific configuration
export const MINI_APP_CONFIG = {
  NAME: "WorldCoin Mini App",
  VERSION: "1.0.0",
  DESCRIPTION:
    "Experience the future of digital identity with WorldCoin verification",
  AUTHOR: "WorldCoin Mini App Developer",
};
