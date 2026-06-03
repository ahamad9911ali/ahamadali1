export interface ParticipantData {
  date: string;
  fii: ParticipantPos;
  dii: ParticipantPos;
  pro: ParticipantPos;
  client: ParticipantPos;
}

export interface ParticipantPos {
  futuresLong: number;
  futuresShort: number;
  optionsLong: number;
  optionsShort: number;
  netOptions: number;
}

export interface StrikeData {
  strike: number;
  ce: OptionSide;
  pe: OptionSide;
}

export interface OptionSide {
  oi: number;
  oiChange: number;
  volume: number;
  ltp: number;
  iv: number;
  trending: boolean;
}

export interface MarketSignal {
  id: string;
  timestamp: string;
  asset: string;
  type: 'BUY' | 'SELL';
  level: number;
  target: number;
  stopLoss: number;
  confidence: number;
  reason: string;
  
  // Pro Option Buying Option Logic
  optionContract?: string;     // e.g. "NIFTY 23400 CE"
  optionLtp?: number;          // e.g. 150
  optionTarget?: number;       // e.g. 225
  optionSL?: number;           // e.g. 110
  pcrRatio?: number;           // e.g. 1.25
  decayRisk?: 'LOW' | 'MEDIUM' | 'HIGH';
  volumeSpike?: string;        // e.g. "3.4x"
  proStrategy?: string;        // e.g. "EMA Crossover Scalp", "Expiry Momentum Blast"
  deltaValue?: number;         // e.g. 0.55
  isExpiryDay?: boolean;       // e.g. true for zero-to-hero expiry day scalps
}

export type Timeframe = '1D' | '1W' | '1M' | '3M';
export type ViewState = 'dashboard' | 'participant' | 'optionChain' | 'strategy' | 'stockFinder' | 'oiAnalytics' | 'institutionalStock' | 'proFiiIndex' | 'sectorRotation' | 'pennyStock' | 'algoTraps' | 'optionMomentum' | 'expiryExpert' | 'slHunter';
