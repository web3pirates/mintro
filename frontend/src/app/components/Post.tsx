'use client'
import React from 'react';

export default function Post() {
  return (
    <div className="px-6 py-4" >
      {/* Post */}
      <div className="pb-4 mb-4">
        <div className="flex space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgb(180 180 184)'}}>
            <span></span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-sm" style={{color: 'rgb(17 24 39)'}}>
              <span className="font-bold">Roberta D'Agostino</span>
            </div>
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">

              {/* Chart */}
              <div className="h-32 bg-gray-100 rounded relative mb-2 border" >
                <svg className="w-full h-full" viewBox="0 0 400 120">
                  <path
                    d="M20 80 L80 85 L120 75 L160 70 L200 65 L240 60 L280 55 L320 50 L360 45"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  <circle cx="360" cy="45" r="3" fill="#10b981" />
                </svg>
                <div className="absolute bottom-2 left-2 bg-white border border-gray-300 px-2 py-1 rounded text-xs shadow-sm" style={{color: 'rgb(17 24 39)'}}>
                  $87.25B MC
                </div>
              </div>
               <div className="flex justify-between text-xs" style={{color: 'rgb(17 24 39)'}}>
                      <div>
                        <div>5 Jan</div>
                        <div className=" font-medium">Bought</div>
                        <div className=" font-medium">$9,150.75</div>
                      </div>
                      <div>
                        <div>13 Jan</div>
                        <div className=" font-medium">Sold</div>
                        <div className=" font-medium">$0.00</div>
                      </div>
                      <div>
                        <div>21 Jan</div>
                        <div className=" font-medium">Holding</div>
                        <div className=" font-medium">$19,100</div>
                      </div>
                      <div>
                        <div>219 Jan</div>
                        <div className=" font-medium">P&L</div>
                        <div className=" font-medium">+52.08% +$9,949.25</div>
                      </div>
                    </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}