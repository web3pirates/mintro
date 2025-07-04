import React from 'react';
import TraderCard from './TraderCard';

const mockActivities = [
  {
    avatarUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Charlie',
    name: 'Charlie Varley',
    handle: 'charlie',
    action: 'Bought',
    asset: 'BNB',
    amount: '20',
    value: '$9,150.75',
    chain: 'Binance',
    timestamp: '1 hour ago',
    txHash: '0xabc123',
    explorerUrl: 'https://bscscan.com/tx/0xabc123',
  },
  {
    avatarUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Alice',
    name: 'Alice Doe',
    handle: 'alice',
    action: 'Sold',
    asset: 'ETH',
    amount: '1.5',
    value: '$2,500.00',
    chain: 'Ethereum',
    timestamp: '5 hours ago',
    txHash: '0xdef456',
    explorerUrl: 'https://etherscan.io/tx/0xdef456',
  },
  {
    avatarUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Bob',
    name: 'Bob Smith',
    handle: 'bob',
    action: 'Transferred',
    asset: 'USDC',
    amount: '1000',
    value: '$1,000.00',
    chain: 'Mantle',
    timestamp: '7 hours ago',
    txHash: '0xghi789',
    explorerUrl: 'https://explorer.mantle.xyz/tx/0xghi789',
  },
];

const TraderFeed: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full py-8 bg-gray-50 min-h-screen">
      {mockActivities.map((activity, idx) => (
        <TraderCard key={idx} {...activity} />
      ))}
    </div>
  );
};

export default TraderFeed; 