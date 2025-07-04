 'use client'
import React, { useState } from 'react';
import { 
  Search, 
  Edit, 
  MoreHorizontal, 
  Filter,
  TrendingUp,
  TrendingDown,
  Copy,
  Gift,
  ArrowUpRight,
  ArrowDownLeft,
  Repeat2
} from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Posts');

  const recentTrades = [
    { action: 'Bought', token: 'BNB', amount: '$2,540', time: '1 hour ago' },
    { action: 'Sold', token: 'Shibainu', amount: '$540', time: '5 hours ago' },
    { action: 'Transferred', token: 'Chainlink', amount: '$500', time: '7 hours ago' }
  ];

  const copiedTrades = [
    { user: 'CryptoKi...', action: 'bought', token: 'BTC', profit: '+$3.12K', percentage: '0.85%', copies: 130 },
    { user: 'BlockCh...', action: 'bought', token: 'AXS', profit: '+$3.78K', percentage: '0.85%', copies: 130 },
    { user: 'Satoshi_bought', action: 'bought', token: 'SOL', profit: '+$6.01K', percentage: '0.85%', copies: 130 },
    { user: 'DigiDyna...', action: 'bought', token: 'BTC', profit: '+$3.12K', percentage: '0.85%', copies: 130 },
    { user: 'TokenTa...', action: 'bought', token: 'AXS', profit: '+$3.78K', percentage: '0.85%', copies: 130 }
  ];

  return (
    <div className=" ">
      {/* Header */}
      <div className="flex items-center justify-between p-4 ">
        <div className="flex items-center space-x-4">
         <div className="w-8 h-8  rounded-full flex items-center justify-center" style={{backgroundColor: 'rgb(17 24 39)'}}>
            <span className="text-white font-bold">★</span>
        </div>

          <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent border-none outline-none text-foreground placeholder-gray-500 flex-1"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-gray-900 rounded-full px-4 py-2"style={{backgroundColor: 'rgb(17 24 39)'}}>
            <Edit className="w-4 h-4" />
            <span>Post Activity</span>
          </button>
          <button className="flex items-center space-x-2 " style={{color: 'rgb(17 24 39)'}}>
            <Gift className="w-4 h-4" />
            <span>Invite & Earn</span>
          </button>
          <div className="w-8 h-8  rounded-full"style={{backgroundColor: 'rgb(180 180 184)'}}></div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="  p-8 space-y-4 flex flex-col justify-center" style={{color: 'rgb(17 24 39)'}}>
          <div className="space-y-2 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full" style={{backgroundColor: 'rgb(180 180 184)'}}></div>
            <div className="w-8 h-8 rounded-full" style={{backgroundColor: 'rgb(180 180 184)'}}></div>
            <button className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgb(17 24 39)'}} >
                 <span className="text-white text-xl">+</span>
            </button>
            <div className="w-8 h-8  rounded-full" style={{backgroundColor: 'rgb(180 180 184)'}}></div>
            <div className="w-8 h-8  rounded-full" style={{backgroundColor: 'rgb(180 180 184)'}}></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-4xl">
          {/* Profile Header */}
          <div className="relative">
            {/* Cover Image */}
            <div className="h-48 bg-gradient-to-r rounded-t-lg from-purple-400 via-pink-400 to-blue-400 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
            </div>
            
            {/* Profile Info */}
            <div className="px-6 pb-4">
              <div className="flex justify-between items-start -mt-16">
                <div className="w-32 h-32 z-100 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgb(180 180 184)'}}>
                  <span className="text-4xl">👤</span>
                </div>
                <div className="flex space-x-2 mt-16">
                  <button className="flex items-center space-x-2 rounded-full px-4 py-2 hover:bg-gray-900">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button className="p-2  rounded-full hover:bg-gray-900">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <h1 className="text-2xl font-bold" style={{color: 'rgb(17 24 39)'}}>Charlie Varley</h1>
                <p className="text-gray-400" style={{color: 'rgb(17 24 39)'}}>@charlie</p>
                <p className="text-gray-400 mt-2" style={{color: 'rgb(17 24 39)'}}>No bio yet...</p>
                <p className="text-gray-400 mt-2" style={{color: 'rgb(17 24 39)'}}>0 Following</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6">
            <div className="flex space-x-8">
              {['Posts', 'Portfolio'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2  font-medium ${
                    activeTab === tab
                      ? ' text-blue-500'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex justify-end py-2">
              <button className="p-2 hover:bg-gray-900 rounded-full">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Post */}
            <div className=" pb-4 mb-4" >
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"style={{backgroundColor: 'rgb(180 180 184)'}}>
                  <span></span>
                </div>
                <div className="flex-1" >
                  <div className="flex items-center space-x-2 text-sm " style={{color: 'rgb(17 24 39)'}}>
                    <span className="font-medium">Charlie Varley</span>
                    <span>New</span>
                  </div>
                  <p className="mt-1" style={{color: 'rgb(17 24 39)'}}>
                    Binance is too big to fail. With their ecosystem, BNB could surprise everyone this cycle. 🔥 Time to load up? 🚀❤️
                  </p>
                   <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground" style={{color: 'rgb(17 24 39)'}}>Bought 🪙 BNB worth $9,150.75 on 🌕 Binance</span>
                      <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                    </div>
                    
                    {/* Chart */}
                  
                                       <div className="h-32 bg-gray-100 rounded relative mb-2 border">
                      <svg className="w-full h-full" viewBox="0 0 400 120">
                        <path
                          d="M20 80 L80 85 L120 75 L160 70 L200 65 L240 60 L280 55 L320 50 L360 45"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                        />
                        <circle cx="360" cy="45" r="3" fill="#10b981" />
                      </svg>
                      <div className="absolute bottom-2 left-2 bg-white border border-gray-300 px-2 py-1 rounded text-xs shadow-sm">
                        $87.25B MC
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex justify-between text-xs text-gray-600">
                      <div>
                        <div>5 Jan</div>
                        <div className="text-foreground font-medium">Bought</div>
                        <div className="text-foreground font-medium">$9,150.75</div>
                      </div>
                      <div>
                        <div>13 Jan</div>
                        <div className="text-foreground font-medium">Sold</div>
                        <div className="text-foreground font-medium">$0.00</div>
                      </div>
                      <div>
                        <div>21 Jan</div>
                        <div className="text-foreground font-medium">Holding</div>
                        <div className="text-foreground font-medium">$19,100</div>
                      </div>
                      <div>
                        <div>219 Jan</div>
                        <div className="text-foreground font-medium">P&L</div>
                        <div className="text-primary font-medium">+52.08% +$9,949.25</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Right Sidebar */}
        <div className="w-80 p-8 space-y-6 " style={{color: 'rgb(17 24 39)'}}>
          {/* Recent Trades */}
          <div>
            <h3 className="font-bold mb-3">Recent Trades</h3>
            <div className="space-y-3">
              {recentTrades.map((trade, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      trade.action === 'Bought' ? 'bg-green-500' : 
                      trade.action === 'Sold' ? 'bg-red-500' : 'bg-blue-500'
                    }`}>
                      {trade.action === 'Bought' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : trade.action === 'Sold' ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : (
                        <Repeat2 className="w-3 h-3" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm">{trade.action} 🪙{trade.token}</div>
                      <div className="text-xs text-gray-400">{trade.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{trade.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Copied By */}
          <div>
            <h3 className="font-bold mb-3">Recently Copied By</h3>
            <div className="space-y-3">
              {copiedTrades.map((trade, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full"style={{backgroundColor: 'rgb(180 180 184)'}}></div>
                    <div>
                      <div className="text-sm">{trade.user} {trade.action} 🪙{trade.token}</div>
                      <div className="text-xs text-green-400">{trade.profit} {trade.percentage}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-800 rounded">
                      <Copy className="w-3 h-3" />
                    </button>
                    <div className="bg-blue-600 text-xs px-2 py-1 rounded-full">
                      {trade.copies}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}