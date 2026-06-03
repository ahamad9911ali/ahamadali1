import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Core';
import { cn } from '../lib/utils';
import { Activity, Beaker, BarChart3, Database, Glasses, Signal, ShieldAlert, Crosshair, ArrowUpRight, ArrowDownRight, ActivitySquare, Flame, TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';
import { isMarketOpen } from '../utils/marketHours';

const INITIAL_INDEX_DATA = {
  NIFTY: {
    name: 'NIFTY 50',
    pcr: 0.78,
    pcrZone: 'Bearish Zone',
    maxPain: 23300,
    spot: 23280,
    trend: 'Sell on Rise',
    overallSignal: 'BEARISH',
    signalReason: 'Call writers aggressive at 23,400-23,500. PCR indicates bearish bias.',
    callZones: [
      { strike: 23500, oi: 120, change: 24, status: 'Strong Resistance' },
      { strike: 23400, oi: 85, change: 12, status: 'Immediate Hurd.' },
      { strike: 23300, oi: 45, change: 2, status: 'Straddle Zone' },
    ],
    putZones: [
      { strike: 23000, oi: 150, change: -5, status: 'Strong Support' },
      { strike: 23100, oi: 75, change: 8, status: 'Immediate Supp.' },
      { strike: 23200, oi: 65, change: 15, status: 'Make or Break' },
    ]
  },
  BANKNIFTY: {
    name: 'BANKNIFTY',
    pcr: 1.15,
    pcrZone: 'Bullish Zone',
    maxPain: 51200,
    spot: 51345,
    trend: 'Buy on Dips',
    overallSignal: 'BULLISH',
    signalReason: 'Strong put writing support at 51,000. PCR comfortably above 1.0.',
    callZones: [
      { strike: 51500, oi: 85, change: 18, status: 'Strong Resistance' },
      { strike: 51400, oi: 55, change: 10, status: 'Immediate Hurd.' },
      { strike: 51300, oi: 30, change: -4, status: 'Straddle Zone' },
    ],
    putZones: [
      { strike: 51000, oi: 110, change: 25, status: 'Strong Support' },
      { strike: 51200, oi: 75, change: 15, status: 'Immediate Supp.' },
      { strike: 51300, oi: 45, change: 8, status: 'Make or Break' },
    ]
  },
  SENSEX: {
    name: 'SENSEX',
    pcr: 0.95,
    pcrZone: 'Neutral Zone',
    maxPain: 76500,
    spot: 76543,
    trend: 'Sideways / Neutral',
    overallSignal: 'NEUTRAL',
    signalReason: 'Equal buildup on both sides. Market searching for direction.',
    callZones: [
      { strike: 77000, oi: 45, change: 5, status: 'Strong Resistance' },
      { strike: 76700, oi: 35, change: 3, status: 'Immediate Hurd.' },
      { strike: 76500, oi: 20, change: 1, status: 'Straddle Zone' },
    ],
    putZones: [
      { strike: 76000, oi: 55, change: 4, status: 'Strong Support' },
      { strike: 76200, oi: 40, change: 2, status: 'Immediate Supp.' },
      { strike: 76500, oi: 25, change: -1, status: 'Make or Break' },
    ]
  }
};

export default function OIAnalytics() {
  const [selectedIndex, setSelectedIndex] = useState<keyof typeof INITIAL_INDEX_DATA>('NIFTY');
  const [indexData, setIndexData] = useState(INITIAL_INDEX_DATA);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isMarketOpen()) return; // Pause ticking updates when market is closed
      setIndexData(prev => {
        const newData = { ...prev };
        const keys = Object.keys(newData) as Array<keyof typeof INITIAL_INDEX_DATA>;
        keys.forEach(k => {
          const tick = (Math.random() - 0.5) * 15;
          newData[k].spot = Number((prev[k].spot + tick).toFixed(2));
          
          let pcrTick = (Math.random() - 0.5) * 0.02;
          let newPcr = prev[k].pcr + pcrTick;
          newData[k].pcr = Number(newPcr.toFixed(2));
          
          if (newPcr > 1.1) newData[k].pcrZone = 'Bullish Zone';
          else if (newPcr < 0.9) newData[k].pcrZone = 'Bearish Zone';
          else newData[k].pcrZone = 'Neutral Zone';

          newData[k].callZones = prev[k].callZones.map(z => ({
            ...z,
            change: z.change + Math.floor((Math.random() - 0.5) * 3)
          }));
          newData[k].putZones = prev[k].putZones.map(z => ({
            ...z,
            change: z.change + Math.floor((Math.random() - 0.5) * 3)
          }));
        });
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentData = indexData[selectedIndex];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4 mt-4 lg:mt-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Database className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Pro OI Analytics</h2>
            <p className="text-slate-400 text-xs font-medium mt-1">PCR Meter, Max Pain, Smart Money Flow & Signals Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#1a1c21] p-1 rounded border border-slate-800">
           <select 
             value={selectedIndex}
             onChange={e => setSelectedIndex(e.target.value as keyof typeof INITIAL_INDEX_DATA)}
             className="bg-[#1a1c21] border-none text-xs font-bold text-white uppercase tracking-widest outline-none px-2 py-1 cursor-pointer focus:ring-0"
           >
             <option value="NIFTY" className="bg-[#101114] py-1">Nifty 50</option>
             <option value="BANKNIFTY" className="bg-[#101114] py-1">Bank Nifty</option>
             <option value="SENSEX" className="bg-[#101114] py-1">Sensex</option>
           </select>
        </div>
      </div>

      {/* Overall Signal */}
      <Card className={cn(
          "overflow-hidden border-l-4 shadow-lg",
            currentData.overallSignal === 'BULLISH' ? "border-l-emerald-500 bg-[#101114] border-t-slate-800 border-r-slate-800 border-b-slate-800" :
            currentData.overallSignal === 'BEARISH' ? "border-l-rose-500 bg-[#101114] border-t-slate-800 border-r-slate-800 border-b-slate-800" :
            "border-l-amber-500 bg-[#101114] border-t-slate-800 border-r-slate-800 border-b-slate-800"
          )}>
             <CardContent className="p-4 md:p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Overall Market Signal</h3>
                  <div className="flex items-center gap-2">
                    <div className={cn("text-xl md:text-2xl font-black tracking-widest uppercase", 
                      currentData.overallSignal === 'BULLISH' ? "text-emerald-400" :
                      currentData.overallSignal === 'BEARISH' ? "text-rose-400" :
                      "text-amber-400"
                    )}>
                      {currentData.overallSignal}
                    </div>
                    <div className="text-xs bg-[#1a1c21] border border-slate-700 px-2 py-0.5 rounded text-slate-300 font-medium hidden sm:block">
                      Trend: <span className="text-white">{currentData.trend}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 break-words max-w-full lg:max-w-xl">{currentData.signalReason}</p>
                </div>
                <div className={cn("p-3 md:p-4 rounded-full bg-opacity-10 hidden sm:block", 
                   currentData.overallSignal === 'BULLISH' ? "bg-emerald-500/20 text-emerald-400" :
                   currentData.overallSignal === 'BEARISH' ? "bg-rose-500/20 text-rose-400" :
                   "bg-amber-500/20 text-amber-400"
                )}>
                   {currentData.overallSignal === 'BULLISH' ? <TrendingUp className="w-8 h-8" /> : currentData.overallSignal === 'BEARISH' ? <TrendingDown className="w-8 h-8" /> : <Activity className="w-8 h-8" />}
                </div>
             </CardContent>
          </Card>

          {/* PCR & Max Pain */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#101114] border-slate-800 col-span-1 md:col-span-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Activity className="w-24 h-24 text-blue-500" />
              </div>
              <CardContent className="p-5 flex flex-col justify-center min-h-[160px]">
                <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">PCR Meter (Put-Call Ratio)</h3>
                <div className="flex items-end gap-6">
                  <div>
                    <div className="text-5xl font-black text-rose-500 tracking-tighter">{currentData.pcr.toFixed(2)}</div>
                    <div className={cn(
                      "text-xs font-bold mt-1 uppercase tracking-wider px-2 py-1 rounded inline-block",
                      currentData.pcrZone === 'Bullish Zone' ? 'bg-emerald-500/10 text-emerald-400' :
                      currentData.pcrZone === 'Bearish Zone' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-amber-500/10 text-amber-400'
                    )}>
                      {currentData.pcrZone}
                    </div>
                  </div>
                  <div className="flex-1 w-full bg-[#15171a] h-3 rounded-full overflow-hidden border border-slate-700 relative mb-2">
                    <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-rose-500 opacity-60"></div>
                    <div className="absolute top-0 bottom-0 left-1/3 w-1/3 bg-amber-500 opacity-60"></div>
                    <div className="absolute top-0 bottom-0 left-2/3 w-1/3 bg-emerald-500 opacity-60"></div>
                    <div 
                      className="absolute top-0 bottom-0 bg-white w-2 rounded-full shadow-[0_0_10px_white] transition-all duration-1000 z-10"
                      style={{ left: `calc(${Math.min(100, Math.max(0, (currentData.pcr / 2) * 100))}%)` }}
                    />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-bold mb-1">{currentData.name}</div>
                    <div className="text-slate-300 font-bold text-sm">Trend: {currentData.trend}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#101114] border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Target className="w-24 h-24 text-amber-500" />
              </div>
              <CardContent className="p-5 flex flex-col justify-center min-h-[160px]">
                <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1 flex justify-between">
                  <span>Max Pain Level</span>
                  <span className="text-[10px] text-amber-500 py-0.5 px-1.5 bg-amber-500/10 rounded">{currentData.name.split(' ')[0]}</span>
                </h3>
                <div className="text-3xl font-black tracking-tight text-white mt-1 mb-3">{currentData.maxPain.toLocaleString()}</div>
                <div className="flex items-center justify-between text-xs font-medium border-t border-slate-800 pt-3">
                  <span className="text-slate-400">Current Spot</span>
                  <span className="text-slate-200">{currentData.spot.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium mt-1">
                  <span className="text-slate-400">Bias</span>
                  <span className="text-amber-400 font-bold">Neutral / At Pain</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call & Put Writing Zones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="bg-[#101114] border-slate-800 border-t-2 border-t-red-500">
               <CardHeader className="p-4 bg-[#15171a] border-b border-slate-800">
                 <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                   <ShieldAlert className="w-4 h-4" /> Call Writing Zones (Resistance)
                 </h3>
               </CardHeader>
               <CardContent className="p-0">
                 <div className="divide-y divide-slate-800/50">
                    {currentData.callZones.map((row, i) => (
                      <div key={i} className="flex justify-between items-center p-3 hover:bg-[#15171a] transition-colors">
                        <div>
                          <div className="text-slate-200 font-bold">{row.strike}</div>
                          <div className="text-[9px] text-slate-500 font-bold uppercase">{row.status}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-slate-300 text-sm font-bold">{row.oi}L</div>
                          <div className={cn("text-[10px] font-bold", row.change > 0 ? "text-emerald-400" : "text-red-400")}>{(row.change > 0 ? '+' : '')}{row.change}L added</div>
                        </div>
                      </div>
                    ))}
                 </div>
               </CardContent>
             </Card>

             <Card className="bg-[#101114] border-slate-800 border-t-2 border-t-emerald-500">
               <CardHeader className="p-4 bg-[#15171a] border-b border-slate-800">
                 <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                   <ShieldAlert className="w-4 h-4" /> Put Writing Zones (Support)
                 </h3>
               </CardHeader>
               <CardContent className="p-0">
                 <div className="divide-y divide-slate-800/50">
                    {currentData.putZones.map((row, i) => (
                      <div key={i} className="flex justify-between items-center p-3 hover:bg-[#15171a] transition-colors">
                        <div>
                          <div className="text-slate-200 font-bold">{row.strike}</div>
                          <div className="text-[9px] text-slate-500 font-bold uppercase">{row.status}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-slate-300 text-sm font-bold">{row.oi}L</div>
                          <div className={cn("text-[10px] font-bold", row.change > 0 ? "text-emerald-400" : "text-red-400")}>{(row.change > 0 ? '+' : '')}{row.change}L {row.change > 0 ? 'added' : 'shed'}</div>
                        </div>
                      </div>
                    ))}
                 </div>
               </CardContent>
             </Card>
          </div>

        <div className="space-y-4">
           <Card className="bg-[#101114] border-slate-800">
             <CardHeader className="p-4 bg-[#15171a] border-b border-slate-800 flex justify-between items-center">
               <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                    <Glasses className="w-4 h-4 text-blue-400" /> Institutional OI Analysis & Flow
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">FII / PRO activity clustering</p>
               </div>
             </CardHeader>
             <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0b0c0f] border border-slate-800 rounded p-4">
                    <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-4 border-b border-blue-900/30 pb-2">Smart Money Index Positioning</h4>
                    <div className="space-y-4">
                       <div className="flex justify-between text-xs font-bold">
                         <span className="text-slate-400">Net Index Longs</span>
                         <span className="text-rose-500">-2.4L Contracts</span>
                       </div>
                       <div className="w-full bg-[#15171a] h-2 rounded-full overflow-hidden">
                         <div className="bg-rose-500 h-full w-[70%]" />
                       </div>
                       
                       <div className="pt-4 border-t border-slate-800">
                         <div className="flex justify-between items-center mb-2">
                           <span className="text-[10px] font-bold text-slate-500 uppercase">Current Flow</span>
                           <span className="px-2 py-0.5 bg-rose-950/50 text-rose-400 text-[9px] font-bold uppercase rounded border border-rose-900">Highly Bearish</span>
                         </div>
                         <p className="text-xs text-slate-400">Institutions are adding aggressive short index futures while hedging with deep OTM Calls.</p>
                       </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#0b0c0f] border border-slate-800 rounded p-4">
                    <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-amber-900/30 pb-2">Institutional Stock Action</h4>
                    <div className="space-y-4">
                       <div className="flex justify-between text-xs font-bold">
                         <span className="text-slate-400">Net Stock Futures</span>
                         <span className="text-emerald-400">+1.2L Contracts</span>
                       </div>
                       <div className="w-full bg-[#15171a] h-2 rounded-full overflow-hidden">
                         <div className="bg-emerald-500 h-full w-[55%]" />
                       </div>

                       <div className="pt-4 border-t border-slate-800">
                         <div className="flex justify-between items-center mb-2">
                           <span className="text-[10px] font-bold text-slate-500 uppercase">Sector Rotation</span>
                           <span className="px-2 py-0.5 bg-emerald-950/50 text-emerald-400 text-[9px] font-bold uppercase rounded border border-emerald-900">Tech Accumulation</span>
                         </div>
                         <p className="text-xs text-slate-400">Consistent stock future long buildup detected in IT and FMCG sectors filtering out broad market weakness.</p>
                       </div>
                    </div>
                  </div>
                </div>
             </CardContent>
           </Card>
        </div>

        <div className="space-y-4">
           <Card className="bg-[#101114] border-slate-800">
             <CardHeader className="p-4 bg-[#15171a] border-b border-slate-800 flex justify-between items-center">
               <div>
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Signal className="w-4 h-4" /> Intraday Signal Tracker
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">Live Bullish/Bearish crossover alerts</p>
               </div>
             </CardHeader>
             <CardContent className="p-0">
               <div className="divide-y divide-slate-800/50">
                  {(() => {
                    const d1 = new Date(); d1.setMinutes(d1.getMinutes() - 5);
                    const d2 = new Date(); d2.setHours(d2.getHours() - 1); d2.setMinutes(d2.getMinutes() - 15);
                    const d3 = new Date(); d3.setHours(d3.getHours() - 2); d3.setMinutes(d3.getMinutes() - 45);
                    const d4 = new Date(); d4.setHours(d4.getHours() - 4); d4.setMinutes(d4.getMinutes() - 20);
                    return [
                      { time: `${d1.getHours().toString().padStart(2, '0')}:${d1.getMinutes().toString().padStart(2, '0')}`, type: 'BULLISH', asset: 'NIFTY', desc: 'Call writers exiting at 23300 CE. Short covering spike.', strength: 'High' },
                      { time: `${d2.getHours().toString().padStart(2, '0')}:${d2.getMinutes().toString().padStart(2, '0')}`, type: 'BEARISH', asset: 'BANKNIFTY', desc: 'Fresh put buying detected by Smart Money. VWAP breakdown.', strength: 'Medium' },
                      { time: `${d3.getHours().toString().padStart(2, '0')}:${d3.getMinutes().toString().padStart(2, '0')}`, type: 'BULLISH', asset: 'FINNIFTY', desc: 'PCR sharply turning upwards from oversold zone. Dip buying.', strength: 'High' },
                      { time: `${d4.getHours().toString().padStart(2, '0')}:${d4.getMinutes().toString().padStart(2, '0')}`, type: 'BEARISH', asset: 'RELIANCE', desc: 'Massive CE addition at ATM strike capping upside.', strength: 'High' },
                    ]
                  })().map((sig, i) => (
                    <div key={i} className="p-4 hover:bg-[#15171a] transition-colors flex flex-col md:flex-row md:items-center gap-4">
                       <div className="w-16 text-xs font-mono text-slate-500">{sig.time}</div>
                       <div className="w-24">
                         <span className={cn(
                           "text-[10px] font-bold uppercase px-2 py-1 rounded inline-flex items-center gap-1",
                           sig.type === 'BULLISH' ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50" : "bg-red-950/40 text-red-400 border border-red-900/50"
                         )}>
                            {sig.type === 'BULLISH' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {sig.type}
                         </span>
                       </div>
                       <div className="flex-1">
                          <div className="text-slate-200 font-bold mb-1">{sig.asset}</div>
                          <div className="text-xs text-slate-400">{sig.desc}</div>
                       </div>
                       <div>
                         <span className={cn(
                           "text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border",
                           sig.strength === 'High' ? "border-amber-500/50 text-amber-500" : "border-blue-500/50 text-blue-500"
                         )}>
                           {sig.strength} Prob
                         </span>
                       </div>
                    </div>
                  ))}
               </div>
             </CardContent>
           </Card>
        </div>

    </div>
  );
}
