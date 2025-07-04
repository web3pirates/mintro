// pages/api/start-listener.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { startAlchemyMonitor } from '@/lib/alchemy-listener';

let listenerStarted = false;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!listenerStarted) {
    startAlchemyMonitor();
    listenerStarted = true;
    res.status(200).json({ status: 'Listener started' });
  } else {
    res.status(200).json({ status: 'Listener already started' });
  }
}
