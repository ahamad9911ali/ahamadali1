import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Core';
import { cn } from '../lib/utils';
import { Clock, ShieldAlert, Crosshair } from 'lucide-react';
import { useLivePrices } from '../contexts/LivePriceContext';

const INDICES = [
  {
    name: 'NIFTY 50',
    ltp: 22850.45,
    chg: -0.25,
    momentum: 'WEAK',
    trap: 'BULL TRAP',
    trapLevel: 22910,
    intervals: [
      { tf: '1m', signal: 'SELL' },
      { tf: '3m', signal: 'SELL' },
      { tf: '5m', signal: 'SELL' },
      { tf: '15m', signal: 'NEUTRAL' }
    ]
  },
  {
    name: 'BANK NIFTY',
    ltp: 48950.20,
    chg: 0.15,
    momentum: 'STRONG',
    trap: 'BEAR TRAP',
    trapLevel: 48800,
    intervals: [
      { tf: '1m', signal: 'BUY' },
      { tf: '3m', signal: 'BUY' },
      { tf: '5m', signal: 'BUY' },
      { tf: '15m', signal: 'BUY' }
    ]
  },
  {
    name: 'FINNIFTY',
    ltp: 21650.80,
    chg: -0.80,
    momentum: 'BEARISH',
    trap: 'NONE',
    trapLevel: null,
    intervals: [
      { tf: '1m', signal: 'SELL' },
      { tf: '3m', signal: 'SELL' },
      { tf: '5m', signal: 'SELL' },
      { tf: '15m', signal: 'SELL' }
    ]
  },
  {
    name: 'SENSEX',
    ltp: 75420.10,
    chg: -0.15,
    momentum: 'BEARISH',
    trap: 'BULL TRAP',
    trapLevel: 75600,
    intervals: [
      { tf: '1m', signal: 'SELL' },
      { tf: '3m', signal: 'SELL' },
      { tf: '5m', signal: 'NEUTRAL' },
      { tf: '15m', signal: 'BUY' }
    ]
  }
];

export default function AlgoTraps() {
  const livePrices = useLivePrices();

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Header */}
      <div className="flex border-b border-slate-800 pb-4 mt-4 lg:mt-0 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <ShieldAlert className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Algo Traps & Momentum</h2>
            <p className="text-slate-400 text-xs font-medium mt-1">Smart money trap detection and interval signals in Index</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INDICES.map(index => {
          const key = index.name.replace(' 50', '').replace(' ', ''); // NIFTY, BANKNIFTY, FINNIFTY, SENSEX
          const ltp = livePrices[key as keyof typeof livePrices] || index.ltp;
          const diff = ltp - index.ltp;
          const newChg = Number((index.chg + (diff / index.ltp) * 100).toFixed(2));
          
          return (
          <Card key={index.name} className="bg-[#101114] border-slate-800">
            <CardHeader className="p-4 border-b border-slate-800 flex flex-row items-center justify-between bg-[#15171a]">
              <div>
                <h3 className="font-bold text-white tracking-wide">{index.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-sm text-slate-300">{ltp.toFixed(2)}</span>
                  <span className={cn("text-[10px] font-mono", newChg >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    {newChg >= 0 ? '+' : ''}{newChg}%
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Momentum</span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold border",
                  index.momentum === 'STRONG' || index.momentum === 'BULLISH' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  index.momentum === 'WEAK' || index.momentum === 'BEARISH' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                  "bg-amber-500/10 text-amber-400 border-amber-500/20"
                )}>
                  {index.momentum}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Trap Status */}
              <div className={cn(
                "p-3 rounded-lg border flex items-start gap-3",
                index.trap === 'BULL TRAP' ? "bg-rose-500/5 border-rose-500/20" :
                index.trap === 'BEAR TRAP' ? "bg-emerald-500/5 border-emerald-500/20" :
                "bg-slate-800/20 border-slate-700/30"
              )}>
                <Crosshair className={cn(
                  "w-5 h-5 mt-0.5",
                  index.trap === 'BULL TRAP' ? "text-rose-400" :
                  index.trap === 'BEAR TRAP' ? "text-emerald-400" :
                  "text-slate-500"
                )} />
                <div>
                  <div className={cn(
                    "font-bold text-sm uppercase tracking-wider",
                    index.trap === 'BULL TRAP' ? "text-rose-400" :
                    index.trap === 'BEAR TRAP' ? "text-emerald-400" :
                    "text-slate-400"
                  )}>
                    {index.trap}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {index.trap === 'NONE' ? 
                      'No clear algo traps detected.' : 
                      `Smart money trapping ${index.trap === 'BULL TRAP' ? 'buyers' : 'sellers'} near ${index.trapLevel} level.`
                    }
                  </div>
                </div>
              </div>

              {/* Interval Signals */}
              <div>
                <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Interval Signals
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {index.intervals.map((inv, i) => (
                    <div key={i} className="bg-[#15171a] border border-slate-800 rounded p-2 text-center">
                      <div className="text-[10px] text-slate-400 font-bold mb-1">{inv.tf}</div>
                      <div className={cn(
                        "text-[10px] font-bold",
                        inv.signal === 'BUY' ? "text-emerald-400" :
                        inv.signal === 'SELL' ? "text-rose-400" :
                        "text-amber-400"
                      )}>
                        {inv.signal}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>
    </div>
  );
}
