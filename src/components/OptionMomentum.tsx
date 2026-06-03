import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/Core';
import { cn } from '../lib/utils';
import { Rocket, Activity, Clock, Target, ShieldAlert, TrendingUp, TrendingDown } from 'lucide-react';
import { isMarketOpen } from '../utils/marketHours';

const INDICES = ['NIFTY 50', 'BANK NIFTY', 'FINNIFTY', 'SENSEX'];

const MOMENTUM_DATA: Record<string, any[]> = {
  'NIFTY 50': [
    { strike: 22900, type: 'CE', ltp: 145.20, chg: '+25.4%', momentumScore: 85, signal: 'STRONG BUY', volumeSpike: '2.5x', time: '14:52:10' },
    { strike: 22850, type: 'CE', ltp: 175.50, chg: '+18.2%', momentumScore: 78, signal: 'BUY', volumeSpike: '1.8x', time: '14:50:45' },
    { strike: 22800, type: 'PE', ltp: 85.40, chg: '-45.2%', momentumScore: 20, signal: 'SELL', volumeSpike: '1.2x', time: '14:48:12' },
    { strike: 22750, type: 'PE', ltp: 65.20, chg: '-52.1%', momentumScore: 15, signal: 'STRONG SELL', volumeSpike: '1.1x', time: '14:45:30' },
  ],
  'BANK NIFTY': [
    { strike: 49000, type: 'CE', ltp: 320.50, chg: '+45.8%', momentumScore: 92, signal: 'STRONG BUY', volumeSpike: '3.2x', time: '14:53:05' },
    { strike: 48900, type: 'CE', ltp: 385.20, chg: '+35.2%', momentumScore: 88, signal: 'BUY', volumeSpike: '2.1x', time: '14:51:24' },
    { strike: 48800, type: 'PE', ltp: 195.40, chg: '-65.4%', momentumScore: 12, signal: 'STRONG SELL', volumeSpike: '1.5x', time: '14:49:00' },
    { strike: 48700, type: 'PE', ltp: 155.80, chg: '-72.5%', momentumScore: 8, signal: 'STRONG SELL', volumeSpike: '1.4x', time: '14:46:15' },
  ],
  'FINNIFTY': [
    { strike: 21700, type: 'CE', ltp: 110.20, chg: '+32.4%', momentumScore: 84, signal: 'STRONG BUY', volumeSpike: '2.8x', time: '14:51:18' },
    { strike: 21650, type: 'CE', ltp: 145.50, chg: '+25.2%', momentumScore: 76, signal: 'BUY', volumeSpike: '1.9x', time: '14:48:50' },
    { strike: 21600, type: 'PE', ltp: 88.40, chg: '-40.2%', momentumScore: 18, signal: 'STRONG SELL', volumeSpike: '1.4x', time: '14:46:02' },
    { strike: 21550, type: 'PE', ltp: 65.20, chg: '-48.5%', momentumScore: 14, signal: 'STRONG SELL', volumeSpike: '1.2x', time: '14:44:11' },
  ],
  'SENSEX': [
    { strike: 75500, type: 'CE', ltp: 425.50, chg: '+15.2%', momentumScore: 65, signal: 'BUY', volumeSpike: '1.5x', time: '14:54:02' },
    { strike: 75600, type: 'CE', ltp: 380.20, chg: '+12.5%', momentumScore: 58, signal: 'NEUTRAL', volumeSpike: '1.2x', time: '14:52:15' },
    { strike: 75200, type: 'PE', ltp: 285.40, chg: '-25.4%', momentumScore: 35, signal: 'SELL', volumeSpike: '1.1x', time: '14:49:10' },
    { strike: 75000, type: 'PE', ltp: 215.80, chg: '-32.5%', momentumScore: 25, signal: 'SELL', volumeSpike: '1.0x', time: '14:47:05' },
  ]
};

export default function OptionMomentum() {
  const [selectedIndex, setSelectedIndex] = useState<string>('NIFTY 50');
  
  const [marketContext, setMarketContext] = useState({
    'NIFTY 50': { trend: 'BULLISH' as const, resistance: '22,550', support: '22,380' },
    'BANK NIFTY': { trend: 'BEARISH' as const, resistance: '48,200', support: '47,800' },
    'FINNIFTY': { trend: 'NEUTRAL' as const, resistance: '21,450', support: '21,300' },
    'SENSEX': { trend: 'BULLISH' as const, resistance: '74,100', support: '73,800' }
  });

  useEffect(() => {
    const marketInterval = setInterval(() => {
      setMarketContext(prev => ({
        'NIFTY 50': {
          trend: Math.random() > 0.6 ? 'BULLISH' : Math.random() > 0.5 ? 'BEARISH' : 'NEUTRAL',
          resistance: (Math.random() > 0.5 ? 22550 : 22600 + Math.floor(Math.random() * 50)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          support: (Math.random() > 0.5 ? 22380 : 22300 - Math.floor(Math.random() * 50)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        },
        'BANK NIFTY': {
           trend: Math.random() > 0.6 ? 'BULLISH' : Math.random() > 0.5 ? 'BEARISH' : 'NEUTRAL',
           resistance: (48000 + Math.floor(Math.random() * 500)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
           support: (47500 - Math.floor(Math.random() * 500)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        },
        'FINNIFTY': {
           trend: Math.random() > 0.6 ? 'BULLISH' : Math.random() > 0.5 ? 'BEARISH' : 'NEUTRAL',
           resistance: (21300 + Math.floor(Math.random() * 200)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
           support: (21100 - Math.floor(Math.random() * 200)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        },
        'SENSEX': {
           trend: Math.random() > 0.6 ? 'BULLISH' : Math.random() > 0.5 ? 'BEARISH' : 'NEUTRAL',
           resistance: (74000 + Math.floor(Math.random() * 500)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
           support: (73500 - Math.floor(Math.random() * 500)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
      }));
    }, 60000);
    return () => clearInterval(marketInterval);
  }, []);

  const [momentumData, setMomentumData] = useState<Record<string, any[]>>(() => {
    // Generate initial live-feeling data
    const d = new Date();
    const data = JSON.parse(JSON.stringify(MOMENTUM_DATA));
    Object.keys(data).forEach(index => {
      data[index].forEach((opt: any, i: number) => {
        const timeOffset = new Date(d.getTime());
        timeOffset.setMinutes(timeOffset.getMinutes() - (data[index].length - i) * 5 - Math.floor(Math.random() * 3));
        opt.time = `${timeOffset.getHours().toString().padStart(2, '0')}:${timeOffset.getMinutes().toString().padStart(2, '0')}:${timeOffset.getSeconds().toString().padStart(2, '0')}`;
      });
    });
    return data;
  });

  useEffect(() => {
    const simulationInterval = setInterval(() => {
      
      setMomentumData(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(indexKey => {
          next[indexKey] = next[indexKey].map(opt => {
            // Apply slight random fluctuations to simulate live feeds
            const scoreChg = Math.floor(Math.random() * 3) - 1;
            const newScore = Math.max(5, Math.min(99, opt.momentumScore + scoreChg));
            const ltpChg = (Math.random() - 0.5) * (opt.ltp * 0.01);
            const newLtp = Number((opt.ltp + ltpChg).toFixed(2));
            
            // Periodically log new trigger time for some options
            let triggerTime = opt.time;
            if (Math.random() > 0.85) {
              const now = new Date();
              triggerTime = now.toLocaleTimeString('en-US', { hour12: false });
            }

            let signal = opt.signal;
            if (newScore >= 80) signal = 'STRONG BUY';
            else if (newScore >= 60) signal = 'BUY';
            else if (newScore >= 40) signal = 'NEUTRAL';
            else if (newScore >= 20) signal = 'SELL';
            else signal = 'STRONG SELL';

            return {
              ...opt,
              momentumScore: newScore,
              ltp: newLtp,
              time: triggerTime,
              signal
            };
          });
        });
        return next;
      });
    }, 1500);

    return () => {
      clearInterval(simulationInterval);
    };
  }, []);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Header */}
      <div className="flex border-b border-slate-800 pb-4 mt-4 lg:mt-0 items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <Rocket className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Option Momentum</h2>
            <p className="text-slate-400 text-xs font-medium mt-1">Fully Automated Options Buy/Sell Signals with Precision Targets & Stops.</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-xs">
        <select
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(e.target.value)}
          className="w-full bg-[#1a1c21] border border-slate-800 rounded-lg px-4 py-2.5 text-sm font-bold text-white outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
          style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2371717a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
          {INDICES.map(index => (
            <option key={index} value={index}>
              {index}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {INDICES.map(asset => (
          <div key={`ctx-${asset}`} className={cn(
            "bg-[#101114] border rounded-lg p-4 flex flex-col justify-center transition-all",
            selectedIndex === asset ? "border-slate-600 shadow-sm" : "border-slate-800 opacity-70"
          )}>
            <div className="flex items-center justify-between mb-2">
               <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{asset}</div>
               <div className={cn(
                  "flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded",
                  marketContext[asset as keyof typeof marketContext]?.trend === 'BULLISH' ? "text-emerald-400 bg-emerald-500/10" :
                  marketContext[asset as keyof typeof marketContext]?.trend === 'BEARISH' ? "text-rose-400 bg-rose-500/10" :
                  "text-slate-400 bg-slate-500/10"
               )}>
                  {marketContext[asset as keyof typeof marketContext]?.trend === 'BULLISH' ? <TrendingUp className="w-3 h-3" /> :
                   marketContext[asset as keyof typeof marketContext]?.trend === 'BEARISH' ? <TrendingDown className="w-3 h-3" /> :
                   <TrendingUp className="w-3 h-3 rotate-90" />} 
                  {marketContext[asset as keyof typeof marketContext]?.trend}
               </div>
            </div>
            <div className="flex justify-between items-center text-xs">
               <div className="space-y-1">
                 <div className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">Resistance</div>
                 <div className="text-rose-400 font-mono font-bold">{marketContext[asset as keyof typeof marketContext]?.resistance}</div>
               </div>
               <div className="w-[1px] h-6 bg-slate-800"></div>
               <div className="space-y-1 text-right">
                 <div className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">Support</div>
                 <div className="text-emerald-400 font-mono font-bold">{marketContext[asset as keyof typeof marketContext]?.support}</div>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {(momentumData[selectedIndex] || []).map((opt, i) => {
          const probability = opt.probability || (55 + (opt.strike + Math.floor(opt.ltp)) % 40);
          
          let exitTime = opt.exitTime;
          if (!exitTime && opt.signal.includes('SELL')) {
            const [h, m, s] = opt.time.split(':').map(Number);
            const exitD = new Date();
            exitD.setHours(h);
            exitD.setMinutes(m + Math.floor(Math.random() * 15) + 5);
            exitD.setSeconds(s || 0);
            exitTime = `${exitD.getHours().toString().padStart(2, '0')}:${exitD.getMinutes().toString().padStart(2, '0')}:${exitD.getSeconds().toString().padStart(2, '0')}`;
          }

          return (
          <Card key={i} className="bg-[#101114] border-slate-800">
            <CardHeader className="p-4 border-b border-slate-800 flex flex-row items-center justify-between bg-[#15171a]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-lg">{opt.strike}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold",
                    opt.type === 'CE' ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                  )}>
                    {opt.type}
                  </span>
                  <span className="bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-orange-500/50 shadow-[0_0_8px_rgba(249,115,22,0.2)]">
                      PRO SIGNAL
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-sm text-slate-300">₹{opt.ltp.toFixed(2)}</span>
                  <span className={cn("text-[10px] font-mono", opt.chg.includes('+') ? "text-emerald-400" : "text-rose-400")}>
                    {opt.chg}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Score</span>
                  <span className="text-xl font-black text-white">{opt.momentumScore}</span>
                </div>

                <div className="flex flex-col items-center shrink-0 border-l border-slate-800 pl-4">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="transparent" className="stroke-slate-800" strokeWidth="3" />
                      <circle cx="18" cy="18" r="14" fill="transparent" className={probability >= 85 ? "stroke-emerald-500" : probability >= 70 ? "stroke-emerald-400" : "stroke-amber-500"} strokeWidth="3" strokeDasharray={2 * Math.PI * 14} strokeDashoffset={2 * Math.PI * 14 - (probability / 100) * (2 * Math.PI * 14)} strokeLinecap="round" />
                    </svg>
                    <div className="absolute flex items-center justify-center">
                      <span className="text-[10px] font-black text-white">{probability}%</span>
                    </div>
                  </div>
                  <span className="text-[7.5px] uppercase font-bold text-slate-500 mt-1 tracking-wider">Win Prob</span>
                </div>
              </div>
            </CardHeader>
             <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Vol Spike</div>
                  <div className="text-sm font-mono text-cyan-400">{opt.volumeSpike}</div>
                </div>
                <div className="text-center flex flex-col items-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Timing (IN/OUT)</div>
                  <div className="flex flex-col gap-0.5 mt-0.5 whitespace-nowrap">
                    <div className="text-[10px] font-mono flex items-center gap-1 justify-center">
                      <span className="font-bold text-slate-400">IN:</span> {opt.time} IST
                    </div>
                    {exitTime && (
                      <div className="text-[10px] font-mono flex items-center gap-1 justify-center text-slate-400">
                        <span className="font-bold text-slate-500">OUT:</span> {exitTime} IST
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Signal</div>
                  <div className={cn(
                    "text-xs font-bold",
                    opt.signal.includes('BUY') ? "text-emerald-400" : 
                    opt.signal.includes('SELL') ? "text-rose-400" : 
                    "text-amber-400"
                  )}>
                    {opt.signal}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2 border-t border-slate-800/50 pt-3">
                <div className="bg-[#15171a] p-2 rounded border border-slate-800 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] uppercase font-bold text-slate-500 mb-0.5">Entry</span>
                  <span className="text-[12px] font-mono font-extrabold text-indigo-400">₹{opt.ltp.toFixed(1)}</span>
                </div>
                <div className="bg-[#15171a] p-2 rounded border border-emerald-900/30 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] uppercase font-bold text-emerald-500 mb-0.5">Target</span>
                  <span className="text-[12px] font-mono font-extrabold text-emerald-400 flex items-center justify-center gap-0.5">
                    <Target className="w-3 h-3" /> ₹{parseFloat((opt.ltp * 1.5).toFixed(1))}
                  </span>
                </div>
                <div className="bg-[#15171a] p-2 rounded border border-rose-900/30 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] uppercase font-bold text-rose-500 mb-0.5">Stop Loss</span>
                  <span className="text-[12px] font-mono font-extrabold text-rose-400 flex items-center justify-center gap-0.5">
                    <ShieldAlert className="w-3 h-3" /> ₹{parseFloat((opt.ltp * 0.5).toFixed(1))}
                  </span>
                </div>
              </div>

              {/* Progress bar for momentum score */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    opt.momentumScore >= 80 ? "bg-emerald-500" :
                    opt.momentumScore >= 60 ? "bg-emerald-400" :
                    opt.momentumScore >= 40 ? "bg-amber-400" :
                    opt.momentumScore >= 20 ? "bg-rose-400" :
                    "bg-rose-500"
                  )}
                  style={{ width: `${Math.max(5, opt.momentumScore)}%` }}
                />
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>
      
      <div className="bg-indigo-950/20 border border-indigo-900/30 p-4 rounded-lg flex items-start gap-3 mt-6">
         <Activity className="w-5 h-5 text-indigo-400 flex-shrink-0" />
         <div>
           <div className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold mb-1">Momentum Algo</div>
           <p className="text-xs text-slate-300 leading-relaxed font-medium">
             Option Momentum tracks the velocity of premium decay or appreciation combined with volume spikes. High momentum scores (&gt;80) indicate strong institutional buying in the specific strike.
           </p>
         </div>
      </div>
    </div>
  );
}
