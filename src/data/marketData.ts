import { ParticipantData, MarketSignal } from '../types';

export const mockParticipantData: ParticipantData[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date('2026-05-29');
  date.setDate(date.getDate() - (89 - i));
  
  // Base values vary slightly based on the index to create trends
  const trend = Math.sin(i / 10) * 50000;
  
  return {
    date: date.toISOString().split('T')[0],
    fii: { 
      futuresLong: 100000 + trend + Math.random() * 20000, 
      futuresShort: 80000 - trend * 0.5 + Math.random() * 15000, 
      optionsLong: 400000 + trend * 2 + Math.random() * 50000, 
      optionsShort: 350000 - trend + Math.random() * 40000, 
      netOptions: 50000 + trend * 3 + Math.random() * 20000 
    },
    dii: { 
      futuresLong: 45000 + Math.random() * 10000, 
      futuresShort: 60000 + Math.random() * 10000, 
      optionsLong: 150000 + Math.random() * 20000, 
      optionsShort: 200000 + Math.random() * 20000, 
      netOptions: -50000 + Math.random() * 10000 
    },
    pro: { 
      futuresLong: 30000 - trend * 0.5 + Math.random() * 10000, 
      futuresShort: 25000 + trend * 0.5 + Math.random() * 10000, 
      optionsLong: 600000 - trend + Math.random() * 50000, 
      optionsShort: 650000 + trend + Math.random() * 50000, 
      netOptions: -50000 - trend * 2 + Math.random() * 20000 
    },
    client: { 
      futuresLong: 80000 - trend * 0.5 + Math.random() * 20000, 
      futuresShort: 105500 + trend * 0.5 + Math.random() * 20000, 
      optionsLong: 1200000 - trend + Math.random() * 100000, 
      optionsShort: 1170000 + trend + Math.random() * 100000, 
      netOptions: 30000 - trend * 1.5 + Math.random() * 30000 
    }
  };
});

export const mockSignals: MarketSignal[] = [
  { id: '1', timestamp: '10:15:22', asset: 'BANKNIFTY', type: 'BUY', level: 51200, target: 51500, stopLoss: 51050, confidence: 0.85, reason: 'Massive CE short covering + FII long buildup' },
  { id: '2', timestamp: '11:30:05', asset: 'NIFTY', type: 'SELL', level: 23150, target: 23000, stopLoss: 23220, confidence: 0.72, reason: 'PCR diving below 0.6 + Resistance at 23200' },
  { id: '3', timestamp: '13:45:10', asset: 'FINNIFTY', type: 'BUY', level: 22800, target: 23000, stopLoss: 22700, confidence: 0.90, reason: 'Pro desks actively selling PE at 22800' },
  { id: '4', timestamp: '14:20:00', asset: 'BANKNIFTY', type: 'BUY', level: 51600, target: 51900, stopLoss: 51450, confidence: 0.65, reason: 'Breakout above day high with volume' },
];
