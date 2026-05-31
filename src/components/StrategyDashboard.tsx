import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from './ui/Core';
import { Target, AlertTriangle, ArrowUpRight, ArrowDownRight, Clock, Zap, TrendingUp, TrendingDown, ShieldAlert, Crosshair, Flame } from 'lucide-react';
import { cn } from '../lib/utils';

type StrategyTab = 'TRAPS' | 'EXPIRY';

const trapSignals = [
  { id: '1', time: '14:24:10', type: 'BEAR TRAP', action: 'BUY CE', asset: 'BANKNIFTY', strike: 51200, price: 340, status: 'ACTIVE', rationale: 'Market broke support. Retail panic PE buying detected. FII Long increasing. Price rapid recovery.' },
  { id: '2', time: '13:15:00', type: 'BULL TRAP', action: 'BUY PE', asset: 'NIFTY', strike: 23200, price: 110, status: 'CLOSED', rationale: 'Market broke resistance. Retail aggressive CE buying. FII Short increasing. Sharp price rejection.' },
];

const expirySignals = [
  { id: '3', time: '14:30:05', type: 'BEARISH EXPIRY', action: 'BUY PE', asset: 'SENSEX', strike: 76500, price: 210, status: 'ACTIVE', rationale: 'Heavy Call Writing. FII Short. CE buyers trapped. Trading below VWAP. Sharp PE spike possible.' },
  { id: '4', time: '10:45:20', type: 'BULLISH EXPIRY', action: 'BUY CE', asset: 'BANKNIFTY', strike: 51000, price: 180, status: 'CLOSED', rationale: 'Heavy Put Writing. FII Long. Short covering detected. Trading above VWAP. Fast CE rally possible.' },
];

export default function StrategyDashboard() {
  const [activeTab, setActiveTab] = useState<StrategyTab>('TRAPS');

  const signals = activeTab === 'TRAPS' ? trapSignals : expirySignals;

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            Smart Money Strategies
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Trap Detection & Expiry Day Institutional Plays</p>
        </div>
        
        <div className="flex bg-[#1a1c21] border border-slate-800 rounded p-0.5">
          <button 
            onClick={() => setActiveTab('TRAPS')}
            className={cn(
              "px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors tracking-wider flex items-center gap-1",
              activeTab === 'TRAPS' ? "bg-blue-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
            )}
          >
            Trap Strategy
          </button>
          <button 
            onClick={() => setActiveTab('EXPIRY')}
            className={cn(
              "px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors tracking-wider flex items-center gap-1",
              activeTab === 'EXPIRY' ? "bg-blue-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
            )}
          >
            Expiry Strategy
          </button>
        </div>
      </div>

      {activeTab === 'TRAPS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <Card className="bg-[#101114] border-slate-800 border-l-2 border-l-emerald-500">
             <CardContent className="p-3">
              <h3 className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><ArrowUpRight className="w-4 h-4" /> Bear Trap → Buy CE</h3>
              <ul className="space-y-1.5 text-[10px] text-slate-400 marker:text-slate-600 list-disc pl-4">
                <li><strong className="text-slate-300">Market breaks support</strong></li>
                <li><strong className="text-slate-300">Retail panic PE buying</strong></li>
                <li><strong className="text-emerald-400/80">FII Long increases</strong></li>
                <li>Price quickly recovers</li>
              </ul>
              <div className="mt-2 bg-emerald-950/20 border border-emerald-900/50 p-2 rounded text-[9px] text-emerald-400 tracking-wider">
                <span className="font-bold">Result:</span> Institutions trapping bears
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#101114] border-slate-800 border-l-2 border-l-red-500">
             <CardContent className="p-3">
              <h3 className="text-[11px] font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><ArrowDownRight className="w-4 h-4" /> Bull Trap → Buy PE</h3>
              <ul className="space-y-1.5 text-[10px] text-slate-400 marker:text-slate-600 list-disc pl-4">
                <li><strong className="text-slate-300">Market breaks resistance</strong></li>
                <li><strong className="text-slate-300">Retail aggressive CE buying</strong></li>
                <li><strong className="text-red-400/80">FII Short increases</strong></li>
                <li>Sharp rejection appears</li>
              </ul>
              <div className="mt-2 bg-red-950/20 border border-red-900/50 p-2 rounded text-[9px] text-red-400 tracking-wider">
                 <span className="font-bold">Result:</span> Institutions trapping bulls
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'EXPIRY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <Card className="bg-[#101114] border-slate-800 border-l-2 border-l-emerald-500">
             <CardContent className="p-3">
              <h3 className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> Bullish Expiry</h3>
              <ul className="space-y-1.5 text-[10px] text-slate-400 marker:text-slate-600 list-disc pl-4">
                <li><strong className="text-slate-300">Heavy Put Writing</strong></li>
                <li><strong className="text-emerald-400/80">FII Long</strong></li>
                <li>Short covering detected</li>
                <li>Trading <strong className="text-blue-400">Above VWAP</strong></li>
              </ul>
              <div className="mt-2 bg-emerald-950/20 border border-emerald-900/50 p-2 rounded text-[9px] text-emerald-400 tracking-wider">
                <span className="font-bold">Result:</span> Fast CE rally possible
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#101114] border-slate-800 border-l-2 border-l-red-500">
             <CardContent className="p-3">
              <h3 className="text-[11px] font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><TrendingDown className="w-4 h-4" /> Bearish Expiry</h3>
               <ul className="space-y-1.5 text-[10px] text-slate-400 marker:text-slate-600 list-disc pl-4">
                <li><strong className="text-slate-300">Heavy Call Writing</strong></li>
                <li><strong className="text-red-400/80">FII Short</strong></li>
                <li>CE buyers trapped</li>
                <li>Trading <strong className="text-rose-400">Below VWAP</strong></li>
              </ul>
              <div className="mt-2 bg-red-950/20 border border-red-900/50 p-2 rounded text-[9px] text-red-400 tracking-wider">
                 <span className="font-bold">Result:</span> Sharp PE spike possible
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Signals Engine */}
      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 mb-2 mt-4"><Zap className="w-3.5 h-3.5 text-yellow-500" /> Live Execution Engine</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {signals.map(signal => (
          <Card key={signal.id} className={cn("bg-[#101114] border-slate-800 border-t-2", signal.action.includes('CE') ? "border-t-emerald-500" : "border-t-red-500")}>
            <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-[#15171a]">
              <div className="flex items-center gap-2">
                <span className={cn("px-1.5 py-0.5 rounded font-bold uppercase text-[9px] border", 
                  signal.action.includes('CE') ? "bg-emerald-950/30 text-emerald-400 border-emerald-900/50" : "bg-red-950/30 text-red-400 border-red-900/50")}>
                  {signal.action}
                </span>
                <span className="text-[11px] font-bold text-white tracking-wider">{signal.asset} {signal.strike}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-[9px] uppercase tracking-widest font-bold", signal.status === 'ACTIVE' ? "text-emerald-500" : "text-slate-500")}>{signal.status}</span>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider flex items-center gap-1"><Clock className="w-3 h-3" /> {signal.time}</span>
              </div>
            </div>
            
            <CardContent className="p-3">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5 block">Signal Type</span>
                  <span className={cn("text-[10px] font-bold uppercase", signal.action.includes('CE') ? "text-emerald-400" : "text-red-400")}>{signal.type}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5 block">Entry Price</span>
                  <span className="text-lg font-bold text-white font-mono">{signal.price}</span>
                </div>
              </div>

              <div className="bg-[#1a1c21] p-2 rounded border border-slate-800">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Logic Trace</span>
                <p className="text-[10px] text-slate-300 italic leading-relaxed">{signal.rationale}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
