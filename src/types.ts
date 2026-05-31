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
}

export type Timeframe = '1D' | '1W' | '1M' | '3M';
export type ViewState = 'dashboard' | 'participant' | 'optionChain' | 'signals' | 'advanced' | 'strategy' | 'stockFinder';
