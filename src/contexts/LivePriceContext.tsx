import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

type LivePrices = {
  NIFTY: number;
  BANKNIFTY: number;
  FINNIFTY: number;
  SENSEX: number;
};

const LivePriceContext = createContext<LivePrices>({
  NIFTY: 23500,
  BANKNIFTY: 51200,
  FINNIFTY: 22800,
  SENSEX: 74500,
});

export const useLivePrices = () => useContext(LivePriceContext);

export const LivePriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<LivePrices>({
    NIFTY: 23500,
    BANKNIFTY: 51200,
    FINNIFTY: 22800,
    SENSEX: 74500,
  });

  useEffect(() => {
    // Connect to the local Node.js Express + Socket.IO server
    const socket: Socket = io();

    socket.on('connect', () => {
      console.log('Connected to Signal Engine via Socket.IO');
    });

    socket.on('price-update', (data: { asset: keyof LivePrices; price: number; timestamp: number }) => {
      setPrices(prev => ({
        ...prev,
        [data.asset]: data.price
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <LivePriceContext.Provider value={prices}>
      {children}
    </LivePriceContext.Provider>
  );
};

