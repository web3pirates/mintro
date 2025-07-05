"use client";

import { useState, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

interface WorldcoinAuthData {
  address: string;
  timestamp: number;
  payload: Record<string, unknown>;
}

interface WorldcoinUser {
  address: string;
  username?: string;
  profilePictureUrl?: string;
}

export const useWorldcoinAuth = () => {
  const [authData, setAuthData] = useState<WorldcoinAuthData | null>(null);
  const [user, setUser] = useState<WorldcoinUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load auth data from localStorage
    const loadAuthData = () => {
      try {
        const stored = localStorage.getItem("worldcoin_auth");
        if (stored) {
          const data: WorldcoinAuthData = JSON.parse(stored);
          // Check if auth is still valid (24 hours)
          const isValid = Date.now() - data.timestamp < 24 * 60 * 60 * 1000;
          if (isValid) {
            setAuthData(data);
            loadUserInfo(data.address);
          } else {
            // Clear expired auth
            localStorage.removeItem("worldcoin_auth");
          }
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
        localStorage.removeItem("worldcoin_auth");
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const loadUserInfo = async (address: string) => {
    try {
      const userInfo = await MiniKit.getUserByAddress(address);
      setUser({
        address,
        username: userInfo?.username,
        profilePictureUrl: userInfo?.profilePictureUrl,
      });
    } catch (error) {
      console.error("Error loading user info:", error);
      setUser({ address });
    }
  };

  const logout = () => {
    localStorage.removeItem("worldcoin_auth");
    setAuthData(null);
    setUser(null);
  };

  const isAuthenticated = !!authData && !!user;

  return {
    authData,
    user,
    isLoading,
    isAuthenticated,
    logout,
  };
};
