import React from 'react';

interface TraderCardProps {
  avatarUrl: string;
  name: string;
  handle: string;
  action: string;
  asset: string;
  amount: string;
  value: string;
  chain: string;
  timestamp: string;
  txHash?: string;
  explorerUrl?: string;
}

const TraderCard: React.FC<TraderCardProps> = ({
  avatarUrl,
  name,
  handle,
  action,
  asset,
  amount,
  value,
  chain,
  timestamp,
  txHash,
  explorerUrl,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 w-full max-w-xl mx-auto mb-4">
      <div className="flex items-center gap-3">
        <img src={avatarUrl} alt={name} className="w-12 h-12 rounded-full border" />
        <div>
          <div className="font-semibold text-lg">{name}</div>
          <div className="text-gray-500 text-sm">@{handle}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 items-center mt-2 text-gray-800">
        <span className="font-semibold">{action}</span>
        <span>{amount} {asset}</span>
        <span className="text-gray-500">({value})</span>
        <span className="px-2 py-0.5 bg-gray-200 rounded text-xs font-medium">{chain}</span>
      </div>
      <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
        <span>{timestamp}</span>
        {txHash && explorerUrl && (
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            View Tx
          </a>
        )}
      </div>
    </div>
  );
};

export default TraderCard; 