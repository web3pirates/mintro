import React, { useState } from "react";

const AMOUNTS = [50, 100, 250, 500, 1000, 5000];
const FREQUENCIES = ["Once", "Daily", "Weekly", "Monthly"];

function AmountInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="number"
      min={1}
      className="w-full rounded-xl bg-gray-100 px-4 !py-2 text-xl !text-purple-700 !border-purple-300 font-semibold mb-6 outline-none focus:ring-2 !focus:ring-purple-400"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="$50"
    />
  );
}

function AmountPresetButtons({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {AMOUNTS.map((amt) => {
        const selected = Number(value) === amt;
        return (
          <button
            key={amt}
            className={`rounded-xl !py-2 !px-2 font-bold text-lg border-2 transition-all ${selected ? "!bg-purple-800 !text-white !border-purple-600" : "bg-white !text-purple-700 !border-purple-300"}`}
            onClick={() => onChange(String(amt))}
          >
            ${amt}
          </button>
        );
      })}
    </div>
  );
}

function FrequencyButtons({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-8">
      {FREQUENCIES.map((freq) => {
        const selected = value === freq;
        return (
          <button
            key={freq}
            className={`rounded-xl py-3 font-bold text-base border-2 transition-all ${selected ? "!bg-purple-600 !text-white !border-purple-600" : "bg-white !text-purple-700 border-purple-300"}`}
            onClick={() => onChange(freq)}
          >
            {freq}
          </button>
        );
      })}
    </div>
  );
}

function SummaryText({ amount, frequency }: { amount: string; frequency: string }) {
  return (
    <div className="text-center text-lg font-medium mt-2 mb-8 !text-black">
      You&apos;re investing <span className="!font-bold !text-purple-700">${amount}</span> on a <span className="font-bold text-purple-700">{frequency.toLowerCase()}</span> basis.
    </div>
  );
}

export default function InvestAmountPage({ onBack, onNext }: { onBack?: () => void; onNext?: () => void }) {
  const [amount, setAmount] = useState("50");
  const [frequency, setFrequency] = useState("Weekly");

  return (
    <div className="min-h-screen bg-white flex flex-col relative px-4 pb-8">
      <button className="absolute left-4 top-6 text-2xl z-10" onClick={onBack}>
        ←
      </button>
      <div className="w-full max-w-md mx-auto pt-16 flex flex-col flex-1">
        <div className="mt-2 mb-6 flex flex-col gap-4">
          <div className="!text-2xl font-extrabold !text-black mb-2">How much do you want<br />to invest?</div>
          <AmountInput value={amount} onChange={setAmount} />
          <AmountPresetButtons value={amount} onChange={setAmount} />
        </div>
        <div className="mb-2">
          <div className="!text-2xl !font-extrabold !text-black mb-2">How often should it recur?</div>
          <FrequencyButtons value={frequency} onChange={setFrequency} />
        </div>
        <SummaryText amount={amount} frequency={frequency} />
        <button
          className="w-full rounded-xl !bg-purple-600 !text-white font-bold text-xl !py-3 mt-auto !shadow-md hover:bg-purple-800 transition"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
} 