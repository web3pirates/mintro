"use client";

import { useSession } from "next-auth/react";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { MiniKit } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";
import Image from "next/image";

interface UserInfo {
  address: string;
  username?: string;
  profilePictureUrl?: string;
}

export const UserInfo = () => {
  const { data: session, status } = useSession();
  const { isInstalled } = useMiniKit();
  const [worldcoinUserInfo, setWorldcoinUserInfo] = useState<UserInfo | null>(
    null
  );

  useEffect(() => {
    const fetchWorldcoinUserInfo = async () => {
      if (session?.user?.walletAddress && isInstalled) {
        try {
          // Access the user's worldcoin information and wallet data
          const userInfo = await MiniKit.getUserByAddress(
            session.user.walletAddress
          );
          setWorldcoinUserInfo({
            address: session.user.walletAddress,
            username: userInfo?.username,
            profilePictureUrl: userInfo?.profilePictureUrl,
          });
        } catch (error) {
          console.error("Error fetching Worldcoin user info:", error);
        }
      }
    };

    fetchWorldcoinUserInfo();
  }, [session?.user?.walletAddress, isInstalled]);

  if (status === "loading") {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Loading user information...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Please log in to see your information</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">User Information</h3>

      <div className="space-y-3">
        <div>
          <strong>Username:</strong> {session.user.username}
        </div>

        <div>
          <strong>Wallet Address:</strong> {session.user.walletAddress}
        </div>

        {worldcoinUserInfo && (
          <>
            <div>
              <strong>Worldcoin Username:</strong>{" "}
              {worldcoinUserInfo.username || "Not available"}
            </div>
            {worldcoinUserInfo.profilePictureUrl && (
              <div>
                <strong>Profile Picture:</strong>
                <Image
                  src={worldcoinUserInfo.profilePictureUrl}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full ml-2 inline-block"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
