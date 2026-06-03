import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Core';
import { cn } from '../lib/utils';
import { RefreshCcw, TrendingUp, TrendingDown, Activity, Layers, BarChart3, Filter, ShieldCheck, ArrowRight } from 'lucide-react';

const SECTORS = [
  { 
    name: 'NIFTY IT', phase: 'LEADING', pricePct: '+2.4%', strength: 85, momentum: 90, flow: '+1,200', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
    stocks: [
      { symbol: 'TCS', pricePct: '+3.1%', signal: 'BULLISH', signalColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { symbol: 'INFY', pricePct: '+2.8%', signal: 'BULLISH', signalColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { symbol: 'HCLTECH', pricePct: '+1.2%', signal: 'NEUTRAL', signalColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
    ]
  },
  { 
    name: 'NIFTY AUTO', phase: 'LEADING', pricePct: '+1.8%', strength: 78, momentum: 82, flow: '+850', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
    stocks: [
      { symbol: 'M&M', pricePct: '+2.5%', signal: 'BULLISH', signalColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { symbol: 'TATAMOTORS', pricePct: '+1.9%', signal: 'BULLISH', signalColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { symbol: 'MARUTI', pricePct: '+0.5%', signal: 'NEUTRAL', signalColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
    ]
  },
  { 
    name: 'NIFTY BANK', phase: 'WEAKENING', pricePct: '-0.5%', strength: 65, momentum: 45, flow: '-420', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20',
    stocks: [
      { symbol: 'HDFCBANK', pricePct: '-1.2%', signal: 'BEARISH', signalColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
      { symbol: 'ICICIBANK', pricePct: '-0.4%', signal: 'NEUTRAL', signalColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
      { symbol: 'SBIN', pricePct: '+0.1%', signal: 'NEUTRAL', signalColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
    ]
  },
  { 
    name: 'NIFTY ENERGY', phase: 'WEAKENING', pricePct: '-1.2%', strength: 60, momentum: 35, flow: '-890', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20',
    stocks: [
      { symbol: 'RELIANCE', pricePct: '-1.8%', signal: 'BEARISH', signalColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
      { symbol: 'ONGC', pricePct: '-0.9%', signal: 'BEARISH', signalColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
      { symbol: 'NTPC', pricePct: '+0.2%', signal: 'NEUTRAL', signalColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
    ]
  },
  { 
    name: 'NIFTY FMCG', phase: 'LAGGING', pricePct: '-0.8%', strength: 35, momentum: 25, flow: '-560', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20',
    stocks: [
      { symbol: 'ITC', pricePct: '-1.1%', signal: 'BEARISH', signalColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
      { symbol: 'HINDUNILVR', pricePct: '-0.6%', signal: 'BEARISH', signalColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
      { symbol: 'NESTLEIND', pricePct: '-0.3%', signal: 'NEUTRAL', signalColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
    ]
  },
  { 
    name: 'NIFTY METAL', phase: 'LAGGING', pricePct: '-1.5%', strength: 20, momentum: 15, flow: '-1,150', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20',
    stocks: [
      { symbol: 'TATASTEEL', pricePct: '-2.1%', signal: 'BEARISH', signalColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
      { symbol: 'HINDALCO', pricePct: '-1.4%', signal: 'BEARISH', signalColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
      { symbol: 'JSWSTEEL', pricePct: '-1.0%', signal: 'BEARISH', signalColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20' }
    ]
  },
  { 
    name: 'NIFTY PHARMA', phase: 'IMPROVING', pricePct: '+0.9%', strength: 45, momentum: 65, flow: '+540', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20',
    stocks: [
      { symbol: 'SUNPHARMA', pricePct: '+1.5%', signal: 'BULLISH', signalColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { symbol: 'CIPLA', pricePct: '+0.8%', signal: 'BULLISH', signalColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { symbol: 'DRREDDY', pricePct: '+0.2%', signal: 'NEUTRAL', signalColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
    ]
  },
  { 
    name: 'NIFTY REALTY', phase: 'IMPROVING', pricePct: '+1.2%', strength: 55, momentum: 70, flow: '+320', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20',
    stocks: [
      { symbol: 'DLF', pricePct: '+2.0%', signal: 'BULLISH', signalColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { symbol: 'LODHA', pricePct: '+1.1%', signal: 'BULLISH', signalColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { symbol: 'OBEROIRLTY', pricePct: '+0.5%', signal: 'NEUTRAL', signalColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
    ]
  },
];

export default function SectorRotation() {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4 mt-4 lg:mt-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <RefreshCcw className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Sector Rotation Model</h2>
            <p className="text-slate-400 text-xs font-medium mt-1">Track institutional money flow through market cycles</p>
          </div>
        </div>
      </div>

      {/* Cycle Overview Banner */}
      <Card className="bg-[#101114] border-slate-800 border-l-4 border-l-purple-500 shadow-lg">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Current Theme</h3>
              <div className="text-xl font-black tracking-widest uppercase text-white mb-2">
                Defensive to Growth Shift
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                Smart money is rotating out of defensive sectors (FMCG) and accumulating high-beta growth (IT & Auto). Financials are showing distribution signs. Align your positional trades with the improving and leading quadrants.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 md:border-l md:border-slate-800 md:pl-6">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Strongest Sector</div>
                <div className="text-emerald-400 font-bold flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> NIFTY IT</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Weakest Sector</div>
                <div className="text-rose-400 font-bold flex items-center gap-1"><TrendingDown className="w-3.5 h-3.5" /> NIFTY METAL</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Cycle Quadrants */}
      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-6 flex items-center gap-2">
        <Layers className="w-4 h-4 text-slate-400" /> Rotation Quadrants
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* IMPROVING -> LEADING row conceptually */}
        <Card className="bg-blue-950/5 border-slate-800 border-t-2 border-t-blue-500">
          <CardHeader className="py-3 px-4 bg-[#15171a] border-b border-slate-800 flex flex-row items-center justify-between">
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
               <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Improving (Accumulation)</h3>
             </div>
             <ArrowRight className="w-4 h-4 text-blue-500/50" />
          </CardHeader>
          <CardContent className="p-4 space-y-3">
             {SECTORS.filter(s => s.phase === 'IMPROVING').map(sector => (
               <div key={sector.name} className="bg-[#101114] p-3 rounded border border-slate-800/60 space-y-3">
                 <div className="flex justify-between items-center">
                   <div>
                     <span className="text-sm font-bold text-slate-200 block">{sector.name}</span>
                     <span className="text-[10px] text-slate-400 font-mono">Mom: {sector.momentum} | Str: {sector.strength}</span>
                   </div>
                   <div className="text-right">
                     <div className="text-emerald-400 text-xs font-mono font-bold">{sector.pricePct}</div>
                     <div className="text-[10px] text-slate-500 font-mono mt-0.5">Flow: {sector.flow}Cr</div>
                   </div>
                 </div>
                 <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/50">
                    {sector.stocks?.map(stock => (
                      <div key={stock.symbol} className={cn("px-2 py-1 flex items-center gap-1 rounded text-[10px] font-bold font-mono border", stock.signalColor)}>
                        {stock.symbol} <span className="opacity-80">{stock.pricePct}</span>
                      </div>
                    ))}
                 </div>
               </div>
             ))}
          </CardContent>
        </Card>

        <Card className="bg-emerald-950/5 border-slate-800 border-t-2 border-t-emerald-500">
          <CardHeader className="py-3 px-4 bg-[#15171a] border-b border-slate-800 flex flex-row items-center justify-between">
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
               <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Leading (Markup)</h3>
             </div>
             <TrendingUp className="w-4 h-4 text-emerald-500/50" />
          </CardHeader>
          <CardContent className="p-4 space-y-3">
             {SECTORS.filter(s => s.phase === 'LEADING').map(sector => (
               <div key={sector.name} className="bg-[#101114] p-3 rounded border border-slate-800/60 space-y-3">
                 <div className="flex justify-between items-center">
                   <div>
                     <span className="text-sm font-bold text-slate-200 block">{sector.name}</span>
                     <span className="text-[10px] text-slate-400 font-mono">Mom: {sector.momentum} | Str: {sector.strength}</span>
                   </div>
                   <div className="text-right">
                     <div className="text-emerald-400 text-xs font-mono font-bold">{sector.pricePct}</div>
                     <div className="text-[10px] text-emerald-500/70 font-mono mt-0.5">Flow: {sector.flow}Cr</div>
                   </div>
                 </div>
                 <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/50">
                    {sector.stocks?.map(stock => (
                      <div key={stock.symbol} className={cn("px-2 py-1 flex items-center gap-1 rounded text-[10px] font-bold font-mono border", stock.signalColor)}>
                        {stock.symbol} <span className="opacity-80">{stock.pricePct}</span>
                      </div>
                    ))}
                 </div>
               </div>
             ))}
          </CardContent>
        </Card>

        {/* LAGGING -> WEAKENING row conceptually */}
        <Card className="bg-rose-950/5 border-slate-800 border-t-2 border-t-rose-500">
          <CardHeader className="py-3 px-4 bg-[#15171a] border-b border-slate-800 flex flex-row items-center justify-between">
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-rose-500"></span>
               <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Lagging (Markdown)</h3>
             </div>
             <TrendingDown className="w-4 h-4 text-rose-500/50" />
          </CardHeader>
          <CardContent className="p-4 space-y-3">
             {SECTORS.filter(s => s.phase === 'LAGGING').map(sector => (
               <div key={sector.name} className="bg-[#101114] p-3 rounded border border-slate-800/60 space-y-3">
                 <div className="flex justify-between items-center">
                   <div>
                     <span className="text-sm font-bold text-slate-200 block">{sector.name}</span>
                     <span className="text-[10px] text-slate-400 font-mono">Mom: {sector.momentum} | Str: {sector.strength}</span>
                   </div>
                   <div className="text-right">
                     <div className="text-rose-400 text-xs font-mono font-bold">{sector.pricePct}</div>
                     <div className="text-[10px] text-rose-500/70 font-mono mt-0.5">Flow: {sector.flow}Cr</div>
                   </div>
                 </div>
                 <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/50">
                    {sector.stocks?.map(stock => (
                      <div key={stock.symbol} className={cn("px-2 py-1 flex items-center gap-1 rounded text-[10px] font-bold font-mono border", stock.signalColor)}>
                        {stock.symbol} <span className="opacity-80">{stock.pricePct}</span>
                      </div>
                    ))}
                 </div>
               </div>
             ))}
          </CardContent>
        </Card>

        <Card className="bg-amber-950/5 border-slate-800 border-t-2 border-t-amber-500">
          <CardHeader className="py-3 px-4 bg-[#15171a] border-b border-slate-800 flex flex-row items-center justify-between">
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-amber-500"></span>
               <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Weakening (Distribution)</h3>
             </div>
             <ArrowRight className="w-4 h-4 text-amber-500/50" />
          </CardHeader>
          <CardContent className="p-4 space-y-3">
             {SECTORS.filter(s => s.phase === 'WEAKENING').map(sector => (
               <div key={sector.name} className="bg-[#101114] p-3 rounded border border-slate-800/60 space-y-3">
                 <div className="flex justify-between items-center">
                   <div>
                     <span className="text-sm font-bold text-slate-200 block">{sector.name}</span>
                     <span className="text-[10px] text-slate-400 font-mono">Mom: {sector.momentum} | Str: {sector.strength}</span>
                   </div>
                   <div className="text-right">
                     <div className="text-rose-400 text-xs font-mono font-bold">{sector.pricePct}</div>
                     <div className="text-[10px] text-slate-500 font-mono mt-0.5">Flow: {sector.flow}Cr</div>
                   </div>
                 </div>
                 <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/50">
                    {sector.stocks?.map(stock => (
                      <div key={stock.symbol} className={cn("px-2 py-1 flex items-center gap-1 rounded text-[10px] font-bold font-mono border", stock.signalColor)}>
                        {stock.symbol} <span className="opacity-80">{stock.pricePct}</span>
                      </div>
                    ))}
                 </div>
               </div>
             ))}
          </CardContent>
        </Card>
      </div>

      {/* Sector Flow Table */}
      <Card className="bg-[#101114] border-slate-800">
        <CardHeader className="p-4 bg-[#15171a] border-b border-slate-800 flex justify-between items-center flex-row">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" /> Sector Flow Data matrix
            </h3>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
             <thead>
               <tr className="bg-[#1a1c21] border-b border-slate-700">
                 <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sector Index</th>
                 <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phase</th>
                 <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Price % Change</th>
                 <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Net Flow (Cr)</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-800/50 text-xs">
                 {SECTORS.map((sector) => (
                    <tr key={sector.name} className="hover:bg-[#15171a] transition-colors">
                      <td className="p-3 font-bold text-slate-200 whitespace-nowrap">{sector.name}</td>
                      <td className="p-3">
                         <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border", sector.bg, sector.color, sector.border)}>
                           {sector.phase}
                         </span>
                      </td>
                      <td className={cn("p-3 font-mono text-sm text-right", sector.pricePct.includes('+') ? "text-emerald-400" : "text-rose-400")}>
                        {sector.pricePct}
                      </td>
                      <td className={cn("p-3 font-mono text-sm text-right", sector.flow.includes('+') ? "text-emerald-400" : "text-rose-400")}>
                        {sector.flow}
                      </td>
                    </tr>
                 ))}
             </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
