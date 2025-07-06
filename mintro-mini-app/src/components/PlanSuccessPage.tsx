import React from "react";

export default function PlanSuccessPage({
  amount,
  frequency,
  cardLast4,
  onBackToHome,
}: {
  amount: string;
  frequency: string;
  cardLast4: string;
  onBackToHome: () => void;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col relative px-4 pb-8">
      <div className="w-full max-w-md mx-auto pt-16 flex flex-col flex-1">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="none" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 13l3 3 7-7" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-black mb-2 text-center">You're all set!</h2>
        <p className="text-gray-500 mb-8 text-center">Nicely done — your portfolio is now on autopilot.</p>
        <div className="bg-white rounded-xl shadow p-6 mb-8 border border-gray-100 text-left">
          <div className="flex justify-between mb-3">
            <span className="text-gray-500">Total</span>
            <span className="font-bold text-black">${amount}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-gray-500">Frequency</span>
            <span className="font-bold text-black">{frequency}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-gray-500">Fees</span>
            <span className="font-bold text-black">$0</span>
          </div>
        </div>
        <button
          onClick={onBackToHome}
          className="w-full !bg-purple-700 !text-white font-bold text-lg py-4 rounded-xl hover:!bg-purple-700 transition-colors mt-auto"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
} 