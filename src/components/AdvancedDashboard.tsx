import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from './ui/Core';
import { Target, Siren, Gauge, Activity, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

type Interval = '3m' | '5m' | '15m';

interface AlgoSignal {
  id: string;
  time: string;
  type: 'CE_BUY' | 'PE_BUY' | 'CE_SELL' | 'PE_SELL';
  strike: number;
  price: number;
  momentum: number;
  interval: Interval;
  status: 'ACTIVE' | 'CLOSED';
}

const ASSETS = {
  NIFTY: { name: 'NIFTY 50' },
  BANKNIFTY: { name: 'BANKNIFTY' },
  SENSEX: { name: 'SENSEX' }
};

const mockSignals: Record<keyof typeof ASSETS, AlgoSignal[]> = {
  BANKNIFTY: [
    { id: '1', time: '14:21:05', type: 'CE_BUY', strike: 51500, price: 345.20, momentum: 85, interval: '3m', status: 'ACTIVE' },
    { id: '2', time: '14:18:10', type: 'PE_SELL', strike: 51300, price: 210.15, momentum: 92, interval: '3m', status: 'ACTIVE' },
    { id: '3', time: '14:15:00', type: 'PE_BUY', strike: 51200, price: 185.40, momentum: 65, interval: '5m', status: 'CLOSED' },
    { id: '4', time: '14:10:22', type: 'CE_SELL', strike: 51800, price: 112.50, momentum: 78, interval: '5m', status: 'ACTIVE' },
    { id: '5', time: '13:45:00', type: 'CE_BUY', strike: 51000, price: 420.00, momentum: 88, interval: '15m', status: 'CLOSED' },
    { id: '6', time: '13:30:00', type: 'PE_SELL', strike: 50800, price: 155.80, momentum: 71, interval: '15m', status: 'ACTIVE' },
  ],
  NIFTY: [
    { id: 'n1', time: '14:25:05', type: 'CE_SELL', strike: 23200, price: 105.20, momentum: 75, interval: '3m', status: 'ACTIVE' },
    { id: 'n2', time: '14:12:10', type: 'PE_BUY', strike: 23000, price: 80.15, momentum: 62, interval: '5m', status: 'ACTIVE' },
  ],
  SENSEX: [
    { id: 's1', time: '14:20:05', type: 'PE_SELL', strike: 76500, price: 445.20, momentum: 95, interval: '3m', status: 'ACTIVE' },
    { id: 's2', time: '14:18:10', type: 'CE_BUY', strike: 76600, price: 310.15, momentum: 82, interval: '3m', status: 'CLOSED' },
  ]
};

const mockTraps: Record<keyof typeof ASSETS, any[]> = {
  BANKNIFTY: [
    { id: 't1', time: '14:24', type: 'BULL_TRAP', level: 51550, description: 'Fake breakout detected. High retail CE buying, Pro desks heavily shorting Calls.', severity: 'HIGH' },
    { id: 't2', time: '14:10', type: 'IV_CRUSH', level: null, description: 'Premium decay algorithm active. Sideways movement expected next 30 mins.', severity: 'MEDIUM' },
    { id: 't3', time: '13:15', type: 'BEAR_TRAP', level: 50900, description: 'Support breakdown failed. Strong put unwinding from DIIs.', severity: 'HIGH' },
  ],
  NIFTY: [
    { id: 'tn1', time: '14:20', type: 'BEAR_TRAP', level: 23050, description: 'Support breach rejected. Short covering expected by Prop desk.', severity: 'HIGH' },
  ],
  SENSEX: [
    { id: 'ts1', time: '14:15', type: 'BULL_TRAP', level: 76800, description: 'Hurdle near resistance, large CE writing detected.', severity: 'HIGH' }
  ]
};

export default function AdvancedDashboard() {
  const [activeInterval, setActiveInterval] = useState<Interval>('3m');
  const [assetKey, setAssetKey] = useState<keyof typeof ASSETS>('BANKNIFTY');
  const [highlightTraps, setHighlightTraps] = useState(false);
  const [pcr, setPcr] = useState(0.82);
  const [momentum, setMomentum] = useState(68);

  // Simulated live updates for PCR
  useEffect(() => {
    const i = setInterval(() => {
      setPcr(prev => +(prev + (Math.random() * 0.04 - 0.02)).toFixed(2));
      setMomentum(prev => Math.min(100, Math.max(0, Math.floor(prev + (Math.random() * 6 - 3)))));
    }, 3000);
    return () => clearInterval(i);
  }, [assetKey]);

  const currentSignals = mockSignals[assetKey] || [];
  const currentTraps = mockTraps[assetKey] || [];
  const selectedAsset = ASSETS[assetKey];

  const filteredSignals = currentSignals.filter(s => s.interval === activeInterval);

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-500" />
            Algorithmic Desk - {selectedAsset.name}
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Momentum, PCR, Trap Detection & Interval Signals</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Asset Selector */}
          <select
            value={assetKey}
            onChange={e => setAssetKey(e.target.value as keyof typeof ASSETS)}
            className="bg-[#1a1c21] border border-slate-800 text-[10px] text-emerald-400 rounded px-2 py-1 outline-none focus:border-blue-500 cursor-pointer uppercase font-bold"
          >
            <option value="NIFTY">NIFTY 50</option>
            <option value="BANKNIFTY">BANKNIFTY</option>
            <option value="SENSEX">SENSEX</option>
          </select>
          
          {/* Interval Selector */}
          <div className="flex bg-[#1a1c21] border border-slate-800 rounded p-0.5">
            {(['3m', '5m', '15m'] as Interval[]).map((int) => (
              <button 
                key={int}
                onClick={() => setActiveInterval(int)}
                className={cn(
                  "px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors tracking-wider flex items-center gap-1",
                  activeInterval === int ? "bg-blue-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {int}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* PCR Widget */}
        <Card className="bg-[#101114] border-slate-800">
          <CardContent className="p-3">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest flex items-center gap-1"><Activity className="w-3 h-3 text-blue-400" /> Live PCR</span>
              <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase", pcr > 1 ? "bg-emerald-950/30 text-emerald-400 border-emerald-900/50" : "bg-red-950/30 text-red-400 border-red-900/50")}>
                {pcr > 1 ? 'Bullish' : 'Bearish'}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-2">{pcr.toFixed(2)}</div>
            <p className="text-[9px] text-slate-500 mt-1">NIFTY 50 Aggregated Volume</p>
            <div className="w-full bg-slate-800 h-1 mt-2 rounded overflow-hidden">
              <div className={cn("h-full transition-all duration-500", pcr > 1 ? "bg-emerald-500" : "bg-red-500")} style={{ width: `${Math.min(100, Math.max(0, pcr * 50))}%` }} />
            </div>
          </CardContent>
        </Card>

        {/* Momentum Widget */}
        <Card className="bg-[#101114] border-slate-800">
          <CardContent className="p-3">
             <div className="flex justify-between items-start mb-1">
              <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest flex items-center gap-1"><Gauge className="w-3 h-3 text-purple-400" /> Options Momentum</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-purple-950/30 text-purple-400 border-purple-900/50 uppercase">
                {momentum > 60 ? 'High' : momentum < 40 ? 'Low' : 'Neutral'}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-2">{momentum}%</div>
            <p className="text-[9px] text-slate-500 mt-1">Velocity of premium expansion</p>
            <div className="w-full bg-slate-800 h-1 mt-2 rounded overflow-hidden">
              <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${momentum}%` }} />
            </div>
          </CardContent>
        </Card>

        {/* System Status Widget */}
         <Card className="bg-[#101114] border-slate-800">
          <CardContent className="p-3 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest shadow-sm">Trap Detector Engine</span>
              <button 
                onClick={() => setHighlightTraps(!highlightTraps)}
                className={cn(
                  "px-1.5 py-0.5 text-[8px] font-bold uppercase rounded border transition-colors",
                  highlightTraps ? "bg-red-950/40 text-red-400 border-red-900/50" : "bg-slate-800/50 text-slate-500 border-slate-700"
                )}
              >
                {highlightTraps ? 'Highlights On' : 'Highlights Off'}
              </button>
            </div>
            <div className="flex items-center gap-3 flex-1 mt-2">
              <div className="w-8 h-8 rounded-full bg-emerald-950/40 border border-emerald-900/50 flex items-center justify-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-400 font-mono tracking-wider">ONLINE</p>
                <p className="text-[9px] text-slate-500 uppercase mt-0.5">Scanning strikes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Interval Signals */}
        <Card className="bg-[#101114] border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle>
              <span>{activeInterval} CE/PE Signals</span>
              <span className="text-[9px] font-normal text-slate-500 font-mono tracking-wider ml-2 bg-slate-800/50 px-1 py-0.5 rounded uppercase">Realtime</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="grid grid-cols-6 text-[9px] font-bold uppercase tracking-widest text-slate-500 border-y border-slate-800 bg-[#15171a] p-2 text-center">
              <div className="text-left">Time</div>
              <div>Signal</div>
              <div>Strike</div>
              <div>Price</div>
              <div>Strength</div>
              <div className="text-right">Status</div>
            </div>
            <div className="divide-y divide-slate-800/50">
              {filteredSignals.length > 0 ? filteredSignals.map(sig => (
                <div key={sig.id} className="grid grid-cols-6 p-2 text-[10px] items-center text-center font-mono hover:bg-slate-800/30 transition-colors">
                  <div className="text-left text-slate-400">{sig.time}</div>
                  <div>
                    <span className={cn("px-1.5 py-0.5 rounded font-bold uppercase text-[9px]", sig.type.includes('BUY') ? "bg-emerald-950/50 text-emerald-400" : "bg-red-950/50 text-red-400")}>
                      {sig.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-white font-bold">{sig.strike}</div>
                  <div className="text-slate-300">{sig.price.toFixed(2)}</div>
                  <div className="flex justify-center text-blue-400 font-bold">{sig.momentum}%</div>
                  <div className="text-right">
                    <span className={cn("text-[9px] uppercase tracking-wider", sig.status === 'ACTIVE' ? "text-emerald-500" : "text-slate-600")}>{sig.status}</span>
                  </div>
                </div>
              )) : (
                <div className="p-6 text-center text-slate-500 text-[10px] italic">No active signals in this timeframe</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Operator Traps */}
        <Card className="bg-[#101114] border-slate-800 flex flex-col border-t-2 border-t-red-500">
          <CardHeader>
            <CardTitle>
              <span className="flex items-center gap-1.5 text-red-400"><Siren className="w-3 h-3" /> API Trap Alerts</span>
              <span className="text-[9px] font-normal text-slate-500 font-mono tracking-wider ml-2 bg-slate-800/50 px-1 py-0.5 rounded uppercase">Pro Desks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-2 flex-1">
            {currentTraps.length > 0 ? (
              currentTraps.map(trap => (
                <div key={trap.id} className={cn(
                  "bg-[#1a1c21] border border-slate-800 rounded p-2 border-l-2 transition-colors",
                  highlightTraps ? "border-l-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse" : "border-l-red-500 hover:bg-slate-800/40"
                )}>
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider flex items-center gap-1">
                        <AlertTriangle className={cn("w-3 h-3", highlightTraps && "text-red-500 animate-bounce")} /> {trap.type.replace('_', ' ')}
                      </span>
                      {trap.level && <span className={cn("rounded px-1 py-0.5 font-mono text-[9px]", highlightTraps ? "bg-red-900/50 border border-red-500/50 text-red-100" : "bg-red-950/30 border border-red-900/50 text-red-300")}>{trap.level}</span>}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">{trap.time}</span>
                  </div>
                  <p className={cn("text-[10px] leading-relaxed italic", highlightTraps ? "text-red-100" : "text-slate-300")}>{trap.description}</p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500 text-[10px] italic">No trap patterns identified in current timeframe.</div>
            )}
            
            <div className="mt-2 bg-slate-800/20 border border-slate-700/50 rounded p-2 text-[9px] text-slate-500 text-center uppercase tracking-widest font-bold">
              Monitoring Institutional Flow vs Retail Volume
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
