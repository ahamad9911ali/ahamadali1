import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Core';
import { cn } from '../lib/utils';
import { IndianRupee, ArrowUpRight, ArrowDownRight, Activity, BarChart3, Filter, ShieldCheck, Zap } from 'lucide-react';

const PENNY_STOCKS = [
  { symbol: 'AMBUJACEM', name: 'Ambuja Cements', ltp: 472.10, mcap: '115,200', chg: '+2.1%', fiiFlow: '+310', proFlow: '+85', netFlow: '+395', signal: 'BUY', signalColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { symbol: 'ITC', name: 'ITC Ltd', ltp: 450.20, mcap: '562,300', chg: '-0.4%', fiiFlow: '-120', proFlow: '+40', netFlow: '-80', signal: 'NEUTRAL', signalColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { symbol: 'TATAPOWER', name: 'Tata Power Co', ltp: 410.80, mcap: '131,200', chg: '+3.5%', fiiFlow: '+450', proFlow: '+120', netFlow: '+570', signal: 'BUY', signalColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { symbol: 'HINDZINC', name: 'Hindustan Zinc', ltp: 395.40, mcap: '167,000', chg: '-1.8%', fiiFlow: '-210', proFlow: '-60', netFlow: '-270', signal: 'SELL', signalColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { symbol: 'JIOFIN', name: 'Jio Financials', ltp: 362.50, mcap: '229,000', chg: '+1.2%', fiiFlow: '+180', proFlow: '+25', netFlow: '+205', signal: 'BUY', signalColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { symbol: 'ONGC', name: 'ONGC Ltd', ltp: 282.10, mcap: '355,500', chg: '+0.5%', fiiFlow: '+45', proFlow: '-15', netFlow: '+30', signal: 'NEUTRAL', signalColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { symbol: 'SUZLON', name: 'Suzlon Energy', ltp: 42.50, mcap: '58,200', chg: '+4.5%', fiiFlow: '+125', proFlow: '+45', netFlow: '+170', signal: 'BUY', signalColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { symbol: 'YESBANK', name: 'Yes Bank', ltp: 24.80, mcap: '76,500', chg: '-1.2%', fiiFlow: '-85', proFlow: '-12', netFlow: '-97', signal: 'SELL', signalColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { symbol: 'IDEA', name: 'Vodafone Idea', ltp: 13.90, mcap: '68,400', chg: '-2.5%', fiiFlow: '-150', proFlow: '-40', netFlow: '-190', signal: 'SELL', signalColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { symbol: 'NHPC', name: 'NHPC Ltd', ltp: 92.40, mcap: '92,100', chg: '+0.8%', fiiFlow: '+65', proFlow: '-15', netFlow: '+50', signal: 'NEUTRAL', signalColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { symbol: 'SOUTHBANK', name: 'South Indian Bank', ltp: 28.60, mcap: '7,400', chg: '+1.1%', fiiFlow: '+15', proFlow: '+5', netFlow: '+20', signal: 'BUY', signalColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { symbol: 'RPOWER', name: 'Reliance Power', ltp: 29.40, mcap: '11,500', chg: '-4.8%', fiiFlow: '-60', proFlow: '-25', netFlow: '-85', signal: 'SELL', signalColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { symbol: 'RENUKA', name: 'Shree Renuka Sugars', ltp: 48.70, mcap: '10,300', chg: '+0.4%', fiiFlow: '+12', proFlow: '-8', netFlow: '+4', signal: 'NEUTRAL', signalColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { symbol: 'UCOBANK', name: 'UCO Bank', ltp: 45.20, mcap: '54,200', chg: '+1.5%', fiiFlow: '+35', proFlow: '+10', netFlow: '+45', signal: 'BUY', signalColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { symbol: 'CENTRALBK', name: 'Central Bank', ltp: 56.40, mcap: '48,600', chg: '+2.1%', fiiFlow: '+42', proFlow: '+15', netFlow: '+57', signal: 'BUY', signalColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { symbol: 'GMRINFRA', name: 'GMR Airports', ltp: 88.30, mcap: '53,200', chg: '-1.4%', fiiFlow: '-45', proFlow: '-10', netFlow: '-55', signal: 'SELL', signalColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { symbol: 'TRIDENT', name: 'Trident Ltd', ltp: 38.60, mcap: '19,500', chg: '+0.8%', fiiFlow: '+10', proFlow: '-2', netFlow: '+8', signal: 'NEUTRAL', signalColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { symbol: 'INFIBEAM', name: 'Infibeam Avenues', ltp: 34.50, mcap: '9,500', chg: '+4.2%', fiiFlow: '+65', proFlow: '+25', netFlow: '+90', signal: 'BUY', signalColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
];

export default function PennyStock() {
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');

  const filteredStocks = PENNY_STOCKS.filter(stock => filter === 'ALL' || stock.signal === filter);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4 mt-4 lg:mt-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <IndianRupee className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Penny & Midcap Scanner</h2>
            <p className="text-slate-400 text-xs font-medium mt-1">Smart money tracking for stocks priced under ₹500 &amp; M.Cap &gt; ₹100Cr</p>
          </div>
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={() => setFilter('ALL')}
             className={cn("px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors", filter === 'ALL' ? "bg-[#1a1c21] text-white border border-slate-600" : "bg-[#101114] text-slate-500 border border-slate-800 hover:bg-[#15171a]")}
           >
             All
           </button>
           <button 
             onClick={() => setFilter('BUY')}
             className={cn("px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors", filter === 'BUY' ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30" : "bg-[#101114] text-emerald-500/50 border border-slate-800 hover:bg-[#15171a]")}
           >
             Buys
           </button>
           <button 
             onClick={() => setFilter('SELL')}
             className={cn("px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors", filter === 'SELL' ? "bg-rose-900/30 text-rose-400 border border-rose-500/30" : "bg-[#101114] text-rose-500/50 border border-slate-800 hover:bg-[#15171a]")}
           >
             Sells
           </button>
        </div>
      </div>

      {/* Analysis Table */}
      <Card className="bg-[#101114] border-slate-800 overflow-hidden">
        <CardHeader className="p-4 bg-[#15171a] border-b border-slate-800 flex justify-between items-center">
           <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
             <Activity className="w-4 h-4 text-blue-400" /> Institutional Flow (Cr)
           </h3>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
             <thead>
               <tr className="bg-[#1a1c21] border-b border-slate-700">
                 <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Symbol</th>
                 <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">M.Cap (Cr)</th>
                 <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">LTP (₹)</th>
                 <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">FII Flow</th>
                 <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Pro Flow</th>
                 <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Net Flow</th>
                 <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Signal</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-800/50">
               {filteredStocks.map((stock, i) => (
                 <tr key={i} className="hover:bg-[#15171a] transition-colors">
                   <td className="p-3">
                     <span className="font-bold text-slate-200 block">{stock.symbol}</span>
                     <span className="text-[10px] text-slate-500">{stock.name}</span>
                   </td>
                   <td className="p-3 text-right">
                     <div className="font-mono text-sm text-slate-300">{stock.mcap}</div>
                   </td>
                   <td className="p-3 text-right">
                     <div className="font-mono font-bold text-white">₹{stock.ltp.toFixed(2)}</div>
                     <div className={cn("text-[10px] font-mono", stock.chg.includes('+') ? "text-emerald-400" : "text-rose-400")}>
                        {stock.chg}
                     </div>
                   </td>
                   <td className="p-3 text-right">
                     <div className={cn("font-mono font-bold text-sm", stock.fiiFlow.includes('+') ? "text-emerald-400" : "text-rose-400")}>
                       {stock.fiiFlow}
                     </div>
                   </td>
                   <td className="p-3 text-right">
                     <div className={cn("font-mono font-bold text-sm", stock.proFlow.includes('+') ? "text-emerald-400" : "text-rose-400")}>
                       {stock.proFlow}
                     </div>
                   </td>
                   <td className="p-3 text-right">
                     <div className={cn("font-mono font-bold px-2 py-1 rounded inline-block text-sm border", 
                        stock.netFlow.includes('+') ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                     )}>
                       {stock.netFlow}
                     </div>
                   </td>
                   <td className="p-3 text-center">
                     <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border inline-flex items-center gap-1", stock.signalColor)}>
                       {stock.signal === 'BUY' && <ArrowUpRight className="w-3 h-3" />}
                       {stock.signal === 'SELL' && <ArrowDownRight className="w-3 h-3" />}
                       {stock.signal}
                     </span>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </CardContent>
      </Card>
      
      {/* Footer Info */}
      <div className="bg-blue-950/20 border border-blue-900/30 p-4 rounded-lg flex items-start gap-3">
         <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />
         <div>
           <div className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-1">Methodology</div>
           <p className="text-xs text-slate-300 leading-relaxed font-medium">
             This scanner isolates stocks priced under ₹500 with a Market Cap &gt; ₹100Cr in the cash/derivatives segment. The Net Flow combines FII and Pro desk cash buying/selling pressure. A BUY signal triggers when both FII and Pro are heavily net long.
           </p>
         </div>
      </div>
    </div>
  );
}
