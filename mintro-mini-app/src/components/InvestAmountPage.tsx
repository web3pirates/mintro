import React, { useState } from "react";
import { useWorldcoinAuth } from "@/hooks/useWorldcoinAuth";

const AMOUNTS = [50, 100, 250, 500, 1000, 5000];
const FREQUENCIES = ["Once", "Daily", "Weekly", "Monthly"];

function AmountInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="number"
      min={1}
      className="w-full rounded-xl bg-gray-100 px-4 !py-2 text-xl !text-purple-700 !border-purple-300 font-semibold mb-6 outline-none focus:ring-2 !focus:ring-purple-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="$50"
    />
  );
}

function AmountPresetButtons({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {AMOUNTS.map((amt) => {
        const selected = Number(value) === amt;
        return (
          <button
            key={amt}
            className={`rounded-xl !py-2 !px-2 font-bold text-lg border-2 transition-all ${
              selected
                ? "!bg-purple-800 !text-white !border-purple-600"
                : "bg-white !text-purple-700 !border-purple-300"
            }`}
            onClick={() => onChange(String(amt))}
          >
            ${amt}
          </button>
        );
      })}
    </div>
  );
}

function FrequencyButtons({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-8">
      {FREQUENCIES.map((freq) => {
        const selected = value === freq;
        return (
          <button
            key={freq}
            className={`rounded-xl py-3 font-bold text-base border-2 transition-all ${
              selected
                ? "!bg-purple-600 !text-white !border-purple-600"
                : "bg-white !text-purple-700 border-purple-300"
            }`}
            onClick={() => onChange(freq)}
          >
            {freq}
          </button>
        );
      })}
    </div>
  );
}

function SummaryText({
  amount,
  frequency,
}: {
  amount: string;
  frequency: string;
}) {
  return (
    <div className="text-center text-lg font-medium mt-2 mb-8 !text-black">
      You&apos;re investing{" "}
      <span className="!font-bold !text-purple-700">${amount}</span>{" "}
      {frequency === "Once" ? (
        "just once."
      ) : (
        <>
          on a{" "}
          <span className="font-bold text-purple-700">
            {frequency.toLowerCase()}
          </span>{" "}
          basis.
        </>
      )}
    </div>
  );
}

export default function InvestAmountPage({
  onBack,
  onNext,
  amount,
  frequency,
  onAmountChange,
  onFrequencyChange,
}: {
  onBack?: () => void;
  onNext?: () => void;
  amount: string;
  frequency: string;
  onAmountChange: (amount: string) => void;
  onFrequencyChange: (frequency: string) => void;
}) {
  const { user, isAuthenticated } = useWorldcoinAuth();
  const [isRamping, setIsRamping] = useState(false);

  const handleRampFunds = async () => {
    if (!isAuthenticated || !user?.address) {
      alert("Please connect your wallet first");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsRamping(true);
    try {
      const response = await fetch("/api/ramp-funds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: user.address,
          amountUsd: Number(amount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create ramp funds URL");
      }

      // Open the World App Add Money URL
      window.open(data.url, "_blank");
    } catch (error) {
      console.error("Error ramping funds:", error);
      alert("Failed to open ramp funds. Please try again.");
    } finally {
      setIsRamping(false);
    }
  };
  return (
    <div className="min-h-screen bg-white flex flex-col relative px-4 pb-8">
      <button className="absolute left-4 top-6 text-2xl z-10" onClick={onBack}>
        ←
      </button>
      <div className="w-full max-w-md mx-auto pt-16 flex flex-col flex-1">
        <div className="mt-2 mb-6 flex flex-col gap-4">
          <div className="!text-2xl font-extrabold !text-black mb-2">
            How much do you want
            <br />
            to invest?
          </div>
          <AmountInput value={amount} onChange={onAmountChange} />
          <AmountPresetButtons value={amount} onChange={onAmountChange} />
        </div>
        <div className="mb-2">
          <div className="!text-2xl !font-extrabold !text-black mb-2">
            How often should it recur?
          </div>
          <FrequencyButtons value={frequency} onChange={onFrequencyChange} />
        </div>
        <SummaryText amount={amount} frequency={frequency} />

        {isAuthenticated && user?.address && (
          <div className="text-center text-sm text-gray-600 mb-4">
            Connected: {user.address.slice(0, 6)}...{user.address.slice(-4)}
          </div>
        )}
        <button
          className="w-ful mb-2 rounded-xl !bg-purple-600 !text-white font-bold text-xl !py-3 mt-auto !shadow-md hover:bg-purple-800 transition"
          onClick={onNext}
        >
          Next
        </button>
        <button
          className="w-full rounded-xl !bg-purple-600 !text-white font-bold text-xl !py-3 mt-4 !shadow-md hover:bg-purple-800 transition"
          onClick={handleRampFunds}
        >
          {isRamping ? "Opening..." : "OnRamp funds"}
        </button>
      </div>
    </div>
  );
}
