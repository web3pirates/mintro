"use client";

import { useState } from "react";
import { IDKitWidget } from "@worldcoin/idkit";
import { Eye, Shield, Globe, CheckCircle, User, Coins } from "lucide-react";

export default function WorldCoinMiniApp() {
  const [isVerified, setIsVerified] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [proof, setProof] = useState(null);

  const handleVerify = async (proof: any) => {
    setProof(proof);
    setIsVerified(true);
    // In a real app, you would send this proof to your backend
    console.log("Verification proof:", proof);
  };

  const handleSuccess = (result: any) => {
    console.log("WorldCoin verification successful:", result);
    setUserAddress(result.merkle_root);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Globe className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              WorldCoin Mini App
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience the future of digital identity with WorldCoin
            verification
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Verification Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Verify Your Identity
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Use WorldCoin to prove you're a unique human without
                    revealing your identity
                  </p>
                </div>

                {!isVerified ? (
                  <IDKitWidget
                    app_id="app_staging_1234567890abcdef" // Replace with your actual app_id
                    action="verify_user"
                    signal="user_value"
                    onSuccess={handleSuccess}
                    walletConnectProjectId="your_wallet_connect_project_id" // Optional
                    verification_level="orb"
                  >
                    {({ open }) => (
                      <button
                        onClick={open}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        Verify with WorldCoin
                      </button>
                    )}
                  </IDKitWidget>
                ) : (
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-600 mb-2">
                      Verification Complete!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your identity has been verified with WorldCoin
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <Coins className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Mini App Features
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Zero-Knowledge Proof
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Prove you're human without revealing personal data
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Privacy First
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Your biometric data stays on your device
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Globe className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Global Access
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Available worldwide through the World App
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Info Section */}
          {isVerified && (
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Verification Details
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Merkle Root
                  </label>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <code className="text-sm text-gray-800 dark:text-gray-200 break-all">
                      {userAddress || "Not available"}
                    </code>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Verification Status
                  </label>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-600 font-medium">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Built with Next.js and WorldCoin IDKit
          </p>
        </div>
      </div>
    </div>
  );
}
