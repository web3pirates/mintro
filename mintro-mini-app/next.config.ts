import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["static.usernames.app-backend.toolsforhumanity.com"],
  },
  allowedDevOrigins: [
    "https://mintro-two.vercel.app",
    "https://5758-83-144-23-154.ngrok-free.app",
  ], // Add your production and dev origins here
  reactStrictMode: false,
};

export default nextConfig;
