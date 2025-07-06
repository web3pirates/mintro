'use client';

import { TabItem, Tabs } from '@worldcoin/mini-apps-ui-kit-react';
import { Bank, Home, User, Wallet } from 'iconoir-react';
import { useState, useEffect } from 'react';

export const Navigation = ({ setScreen }: { setScreen: (screen: "main" | "adjust" | "invest" | "confirm" | "balance") => void }) => {
  const [value, setValue] = useState('home');

  const handleValueChange = (newValue: string) => {
    console.log('handleValueChange called:', { newValue, currentValue: value });
    
    // Prevent unnecessary navigation if already on the correct tab
    if (newValue === value) {
      console.log('Already on correct tab, skipping navigation');
      return;
    }
    
    setValue(newValue);
    
    // Set the appropriate screen
    if (newValue === 'home') {
      console.log('Setting screen to main');
      setScreen('main');
    } else if (newValue === 'wallet') {
      console.log('Setting screen to main (wallet view)');
      setScreen('main');
    } else if (newValue === 'walletbalance') {
      console.log('Setting screen to balance');
      setScreen('balance');
    }
  };

  return (
    <Tabs value={value} onValueChange={handleValueChange}>
      <TabItem value="home" icon={<Home />} label="Home" />
      <TabItem value="walletbalance" icon={<Wallet />} label="Balance" />
    </Tabs>
  );
};
