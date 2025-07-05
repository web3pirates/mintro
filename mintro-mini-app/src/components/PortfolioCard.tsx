'use client';

import React from "react";
import { FaBitcoin } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";

const SolanaIcon = () => (
  <svg viewBox="0 0 397.7 311.7" className="w-6 h-6">
    <defs>
      <linearGradient id="solGradient1" gradientUnits="userSpaceOnUse" x1="360.8791" y1="351.4553" x2="141.213" y2="-69.2936" gradientTransform="matrix(1 0 0 -1 0 314)">
        <stop offset="0" style={{stopColor:"#00FFA3"}}/>
        <stop offset="1" style={{stopColor:"#DC1FFF"}}/>
      </linearGradient>
      <linearGradient id="solGradient2" gradientUnits="userSpaceOnUse" x1="264.8291" y1="401.6014" x2="45.163" y2="-19.1475" gradientTransform="matrix(1 0 0 -1 0 314)">
        <stop offset="0" style={{stopColor:"#00FFA3"}}/>
        <stop offset="1" style={{stopColor:"#DC1FFF"}}/>
      </linearGradient>
      <linearGradient id="solGradient3" gradientUnits="userSpaceOnUse" x1="312.5484" y1="376.688" x2="92.8822" y2="-44.061" gradientTransform="matrix(1 0 0 -1 0 314)">
        <stop offset="0" style={{stopColor:"#00FFA3"}}/>
        <stop offset="1" style={{stopColor:"#DC1FFF"}}/>
      </linearGradient>
    </defs>
    <path fill="url(#solGradient1)" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5 c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
    <path fill="url(#solGradient2)" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5 c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
    <path fill="url(#solGradient3)" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4 c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
  </svg>
);

const WorldcoinIcon = () => (
  <svg viewBox="0 0 600.10632 600.10632" className="w-6 h-6">
    <g transform="translate(-99.689875,-99.947068)">
      <g transform="matrix(1.2367001,0,0,1.2367001,-668.2998,-668.50879)">
        <g transform="matrix(1.2994699,0,0,1.2994699,725.31494,727.89368)">
          <g transform="translate(131.17999,104.74)">
            <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="35px" d="m 119.067,-87.470001 c 0,0 -145.507001,0.230003 -145.507001,0.230003 C -74.620003,-87.239998 -113.68,-48.18 -113.68,0 c 0,48.18 39.059997,87.239998 87.239999,87.239998 0,0 140.120001,0 140.120001,0"/>
          </g>
        </g>
        <g transform="matrix(1.2994699,0,0,1.2994699,643.73987,841.25928)">
          <g>
            <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="35px" d="m 2.309,17.5 c 0,0 336.11101,0 336.11101,0"/>
          </g>
        </g>
        <g transform="matrix(1.2994699,0,0,1.2994699,620.99915,621.3761)">
          <g transform="translate(186.71001,186.71001)">
            <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="35px" d="M 0,-169.21001 C 93.452003,-169.21001 169.21001,-93.452003 169.21001,0 169.21001,93.452003 93.452003,169.21001 0,169.21001 -93.452003,169.21001 -169.21001,93.452003 -169.21001,0 -169.21001,-93.452003 -93.452003,-169.21001 0,-169.21001 Z"/>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

const tokens = [
  {
    symbol: "WLD",
    name: "Worldcoin",
    icon: <WorldcoinIcon />,
    change: "+12.2%",
    changeColor: "text-green-600",
    allocation: 30,
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    icon: <FaBitcoin className="text-2xl text-[#F7931A]" />,
    change: "+1.5%",
    changeColor: "text-green-600",
    allocation: 40,
  },
  {
    symbol: "SOL",
    name: "Solana",
    icon: <SolanaIcon />,
    change: "+3.4%",
    changeColor: "text-green-600",
    allocation: 30,
  },
];

export const PortfolioCard = ({ onInvestClick }: { onInvestClick?: () => void }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center text-black font-extrabold text-2xl">Create a new portfolio</div>
      <div className="bg-white rounded-xl !shadow-lg py-4 px-6">
        <div className="text-center text-black text-lg font-semibold mb-4">Balanced Majors</div>
        <div className="divide-y">
          <div className="flex justify-between text-gray-500 font-medium pb-2">
            <span>Token</span>
            <span>Last 24h</span>
            <span>Allocation</span>
          </div>
          {tokens.map((token) => (
            <div key={token.symbol} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 min-w-[90px]">
                {token.icon}
                <span className="font-bold text-black">{token.symbol}</span>
              </div>
              <div className="flex items-center gap-1 justify-center min-w-[80px]">
                <FiTrendingUp className="text-green-500 text-base" />
                <span className="text-green-600 font-semibold">{token.change}</span>
              </div>
              <div className="flex items-center gap-2 min-w-[90px] justify-end">
                <span className="font-semibold text-gray-700">{token.allocation}%</span>
                <div className="w-10 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-gray-700 h-full" style={{ width: `${token.allocation}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="w-fit px-4 !bg-purple-700 !text-white font-bold text-lg py-2 rounded-xl shadow-md hover:bg-purple-700 transition"
            onClick={onInvestClick}
          >
            Invest in this portfolio
          </button>
        </div>
      </div>
    </div>
  );
}; 