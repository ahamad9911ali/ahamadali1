import { ParticipantData, MarketSignal } from '../types';

export const mockParticipantData: ParticipantData[] = [
  {
    date: '2026-05-25',
    fii: { futuresLong: 120500, futuresShort: 85000, optionsLong: 450000, optionsShort: 380000, netOptions: 70000 },
    dii: { futuresLong: 45000, futuresShort: 60000, optionsLong: 150000, optionsShort: 200000, netOptions: -50000 },
    pro: { futuresLong: 30000, futuresShort: 25000, optionsLong: 600000, optionsShort: 650000, netOptions: -50000 },
    client: { futuresLong: 80000, futuresShort: 105500, optionsLong: 1200000, optionsShort: 1170000, netOptions: 30000 }
  },
  {
    date: '2026-05-26',
    fii: { futuresLong: 125000, futuresShort: 82000, optionsLong: 480000, optionsShort: 390000, netOptions: 90000 },
    dii: { futuresLong: 46000, futuresShort: 62000, optionsLong: 140000, optionsShort: 190000, netOptions: -50000 },
    pro: { futuresLong: 32000, futuresShort: 24000, optionsLong: 620000, optionsShort: 670000, netOptions: -50000 },
    client: { futuresLong: 78000, futuresShort: 108000, optionsLong: 1150000, optionsShort: 1140000, netOptions: 10000 }
  },
  {
    date: '2026-05-27',
    fii: { futuresLong: 130000, futuresShort: 80000, optionsLong: 510000, optionsShort: 400000, netOptions: 110000 },
    dii: { futuresLong: 47000, futuresShort: 65000, optionsLong: 130000, optionsShort: 180000, netOptions: -50000 },
    pro: { futuresLong: 35000, futuresShort: 22000, optionsLong: 650000, optionsShort: 720000, netOptions: -70000 },
    client: { futuresLong: 75000, futuresShort: 115000, optionsLong: 1100000, optionsShort: 1090000, netOptions: 10000 }
  },
  {
    date: '2026-05-28',
    fii: { futuresLong: 145000, futuresShort: 75000, optionsLong: 550000, optionsShort: 410000, netOptions: 140000 },
    dii: { futuresLong: 48000, futuresShort: 68000, optionsLong: 125000, optionsShort: 175000, netOptions: -50000 },
    pro: { futuresLong: 40000, futuresShort: 20000, optionsLong: 680000, optionsShort: 780000, netOptions: -100000 },
    client: { futuresLong: 70000, futuresShort: 140000, optionsLong: 1050000, optionsShort: 1040000, netOptions: 10000 }
  },
  {
    date: '2026-05-29',
    fii: { futuresLong: 155000, futuresShort: 70000, optionsLong: 600000, optionsShort: 420000, netOptions: 180000 },
    dii: { futuresLong: 49000, futuresShort: 70000, optionsLong: 120000, optionsShort: 170000, netOptions: -50000 },
    pro: { futuresLong: 45000, futuresShort: 18000, optionsLong: 720000, optionsShort: 850000, netOptions: -130000 },
    client: { futuresLong: 65000, futuresShort: 156000, optionsLong: 1000000, optionsShort: 1000000, netOptions: 0 }
  }
];

export const mockSignals: MarketSignal[] = [
  { id: '1', timestamp: '10:15:22', asset: 'BANKNIFTY', type: 'BUY', level: 51200, target: 51500, stopLoss: 51050, confidence: 0.85, reason: 'Massive CE short covering + FII long buildup' },
  { id: '2', timestamp: '11:30:05', asset: 'NIFTY', type: 'SELL', level: 23150, target: 23000, stopLoss: 23220, confidence: 0.72, reason: 'PCR diving below 0.6 + Resistance at 23200' },
  { id: '3', timestamp: '13:45:10', asset: 'FINNIFTY', type: 'BUY', level: 22800, target: 23000, stopLoss: 22700, confidence: 0.90, reason: 'Pro desks actively selling PE at 22800' },
  { id: '4', timestamp: '14:20:00', asset: 'BANKNIFTY', type: 'BUY', level: 51600, target: 51900, stopLoss: 51450, confidence: 0.65, reason: 'Breakout above day high with volume' },
];
