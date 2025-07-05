'use client'
import React, { useState } from 'react';
import { MoreHorizontal, TrendingUp, TrendingDown, Send, ArrowDownToLine, ArrowUpDown, ShoppingCart } from 'lucide-react';

const WalletDashboard = () => {
  const [activeTab, setActiveTab] = useState('tokens');

  const tokens = [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      icon: '🟣',
      available: '$4,057.09',
      amount: '1.25 ETH',
      price24h: '2,581.64',
      change: '-2.9%',
      changeColor: 'text-red-500',
      allocation: 60.9,
      network: 'ethereum'
    },
    {
      name: 'IOTA',
      symbol: 'IOTA',
      icon: '⚫',
      available: '$0.79',
      amount: '3.456 IOTA',
      price24h: '$0.2282',
      change: '+1.08%',
      changeColor: 'text-green-500',
      allocation: 25,
      network: 'iota'
    },
    {
      name: 'BNB',
      symbol: 'BNB',
      icon: '🟡',
      available: '$7,890.12',
      amount: '7.890 BNB',
      price24h: '$2,740.00',
      change: '+18.08%',
      changeColor: 'text-green-500',
      allocation: 5,
      network: 'bsc'
    },
    {
      name: 'Tether',
      symbol: 'USDT',
      icon: '🟢',
      available: '$1,234.56',
      amount: '1,234 USDT',
      price24h: '$1.00',
      change: '+0.01%',
      changeColor: 'text-green-500',
      allocation: 2.3,
      network: 'ethereum'
    },
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: '🟠',
      available: '$485.65',
      amount: '0.0045 BTC',
      price24h: '$107,921.76',
      change: '+0.01%',
      changeColor: 'text-green-500',
      allocation: 1.4,
      network: 'bitcoin'
    }
  ];

  const getNetworkIcon = (network:any) => {
    const icons:any = {
      ethereum: 'ETH',
      iota: 'IOTA',
      bsc: 'BNB',
      bitcoin: 'BTC',
      usdt: 'USDT',
      polygon: 'MATIC',
      solana: 'SOL',
      avalanche: 'AVAX',
      cardano: 'ADA',
      polkadot: 'DOT',
      ripple: 'XRP',
    };
    return icons[network] || '⚪';
  };

  return (
    <div className="min-h-screen" style={{color: 'rgb(17 24 39)'}}>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Wallet Overview */}
        <div className="mb-8">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{color: 'rgb(17 24 39)'}}>$44,030</h1>
              <p className="text-gray-600">186 tokens</p>
            </div>
            <div className="flex space-x-3">
              <button className="text-white px-4 py-2 rounded-full flex items-center space-x-2" style={{backgroundColor: 'rgb(17 24 39)'}}>
                <ArrowDownToLine className="w-4 h-4" />
                <span>Receive</span>
              </button>
              <button className="bg-gray-200 hover:bg-zinc-300 px-4 py-2 rounded-full flex items-center space-x-2 transition-colors" style={{color: 'rgb(17 24 39)'}}>
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
              <button className="bg-gray-200 hover:bg-zinc-300 px-4 py-2 rounded-full flex items-center space-x-2 transition-colors" style={{color: 'rgb(17 24 39)'}}>
                <ArrowUpDown className="w-4 h-4" />
                <span>Swap</span>
              </button>
              <button className="bg-gray-200 hover:bg-zinc-300 px-4 py-2 rounded-full flex items-center space-x-2 transition-colors" style={{color: 'rgb(17 24 39)'}}>
                <ShoppingCart className="w-4 h-4" />
                <span>Buy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {['tokens', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'tokens' && (
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-400 ">
              <div className="col-span-3">Token</div>
              <div className="col-span-2">Available</div>
              <div className="col-span-2">24H Price</div>
              <div className="col-span-2">Network</div>
              <div className="col-span-2">Allocation</div>
              <div className="col-span-1"></div>
            </div>

            {/* Token List */}
            <div className="space-y-2">
              {tokens.map((token, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-zinc-300 rounded-lg transition-colors cursor-pointer"
                >
                  {/* Token Info */}
                  <div className="col-span-3 flex items-center space-x-3">
                    <div>
                      <div className="font-medium">{token.name}</div>
                      <div className="text-gray-400 text-sm">{token.symbol}</div>
                    </div>
                  </div>

                  {/* Available */}
                  <div className="col-span-2 flex flex-col justify-center">
                    <div className="font-medium">{token.available}</div>
                    <div className="text-gray-400 text-sm">{token.amount}</div>
                  </div>

                  {/* 24H Price */}
                  <div className="col-span-2 flex flex-col justify-center">
                    <div className="font-medium">{token.price24h}</div>
                    <div className={`text-sm flex items-center ${token.changeColor}`}>
                      {token.change.startsWith('+') ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {token.change}
                    </div>
                  </div>

                  {/* Network */}
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{getNetworkIcon(token.network)}</span>
                    </div>
                  </div>

                  {/* Allocation */}
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center space-x-2 w-full">
                      <span className="text-sm font-medium">{token.allocation}%</span>
                      <div className="flex-1 bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${token.allocation}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end">
                    <button className="p-2 hover:bg-gray-800 rounded-full">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="text-center py-20">
            <div className="text-gray-400">
              <div className="text-4xl mb-4">📊</div>
              <p>Your transaction activity will appear here</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WalletDashboard;