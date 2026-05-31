import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from './ui/Core';
import { Activity, TrendingUp, TrendingDown, RefreshCw, Crosshair, Minus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

const INITIAL_ASSETS = {
  NIFTY: { 
    name: 'NIFTY 50', 
    spot: 23124.50, change: -112.30, pct: -0.48, 
    pcr: 0.75, maxPain: 23000, trend: 'BEARISH', 
    res2: 23500, res1: 23300, sup1: 23000, sup2: 22800,
    pcrHistory: [
      { time: '09:15', pcr: 0.8 }, { time: '09:30', pcr: 0.85 }, { time: '10:00', pcr: 0.78 },
      { time: '10:30', pcr: 0.75 }, { time: '11:00', pcr: 0.81 }, { time: '11:30', pcr: 0.79 },
      { time: '12:00', pcr: 0.76 }, { time: '12:30', pcr: 0.72 }, { time: '13:00', pcr: 0.70 },
      { time: '13:30', pcr: 0.74 }, { time: '14:00', pcr: 0.75 }, { time: '14:30', pcr: 0.75 },
    ]
  },
  BANKNIFTY: { 
    name: 'BANKNIFTY',
    spot: 51345.20, change: 420.50, pct: 0.82, 
    pcr: 1.15, maxPain: 51000, trend: 'BULLISH', 
    res2: 51800, res1: 51500, sup1: 51000, sup2: 50500,
    pcrHistory: [
      { time: '09:15', pcr: 0.9 }, { time: '09:30', pcr: 0.95 }, { time: '10:00', pcr: 1.02 },
      { time: '10:30', pcr: 1.05 }, { time: '11:00', pcr: 1.08 }, { time: '11:30', pcr: 1.15 },
      { time: '12:00', pcr: 1.25 }, { time: '12:30', pcr: 1.18 }, { time: '13:00', pcr: 1.12 },
      { time: '13:30', pcr: 1.10 }, { time: '14:00', pcr: 1.14 }, { time: '14:30', pcr: 1.15 },
    ]
  },
  SENSEX: { 
    name: 'SENSEX', 
    spot: 76543.20, change: -15.40, pct: -0.02, 
    pcr: 0.95, maxPain: 76500, trend: 'NEUTRAL', 
    res2: 77200, res1: 76800, sup1: 76200, sup2: 75800,
    pcrHistory: [
      { time: '09:15', pcr: 0.98 }, { time: '09:30', pcr: 0.96 }, { time: '10:00', pcr: 0.95 },
      { time: '10:30', pcr: 0.92 }, { time: '11:00', pcr: 0.94 }, { time: '11:30', pcr: 0.96 },
      { time: '12:00', pcr: 0.95 }, { time: '12:30', pcr: 0.91 }, { time: '13:00', pcr: 0.93 },
      { time: '13:30', pcr: 0.95 }, { time: '14:00', pcr: 0.96 }, { time: '14:30', pcr: 0.95 },
    ]
  }
};

export default function Dashboard() {
  const [activeChartAsset, setActiveChartAsset] = useState<keyof typeof INITIAL_ASSETS>('NIFTY');
  const [assets, setAssets] = useState(INITIAL_ASSETS);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => {
        const next = { ...prev };
        (Object.keys(next) as Array<keyof typeof INITIAL_ASSETS>).forEach(key => {
          const asset = { ...next[key] };
          
          const spotTick = (Math.random() * 8) - 4; 
          asset.spot = asset.spot + spotTick;
          asset.change = asset.change + spotTick;
          const baseValue = asset.spot - asset.change;
          asset.pct = Number(((asset.change / baseValue) * 100).toFixed(2));
          
          const pcrTick = (Math.random() * 0.02) - 0.01;
          asset.pcr = Math.max(0.1, asset.pcr + pcrTick);

          const currentHist = [...asset.pcrHistory];
          currentHist[currentHist.length - 1] = { 
            ...currentHist[currentHist.length - 1], 
            pcr: Number(asset.pcr.toFixed(2)) 
          };
          asset.pcrHistory = currentHist;

          next[key] = asset;
        });
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-sm font-bold text-white">Market Overview</h2>
          <p className="text-slate-500 text-[10px] mt-0.5 flex gap-2">Live Institutional Flow, PCR, and Option Levels</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="px-2 py-0.5 bg-emerald-950/20 text-emerald-400 border-emerald-900/50 shadow-[0_0_10px_rgba(16,185,129,0.1)] gap-1.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            MARKET OPEN
          </Badge>
          <button className="p-1.5 bg-[#1a1c21] border border-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(assets).map(([key, data]) => (
          <Card key={key} className="bg-[#101114] border-slate-800 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
              {data.trend === 'BULLISH' ? <TrendingUp className="w-16 h-16" /> : data.trend === 'BEARISH' ? <TrendingDown className="w-16 h-16" /> : <Minus className="w-16 h-16" />}
            </div>
            <CardContent className="p-3 relative z-10 flex flex-col h-full gap-3">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1">{data.name}</p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-xl font-bold font-mono text-white">{data.spot.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                  </div>
                  <p className={cn("text-[10px] flex items-center font-bold gap-1 font-mono", data.change > 0 ? "text-emerald-400" : data.change < 0 ? "text-red-400" : "text-yellow-400")}>
                    {data.change > 0 ? <TrendingUp className="w-3 h-3" /> : data.change < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    {data.change > 0 ? '+' : ''}{data.change.toFixed(2)} ({data.change > 0 ? '+' : ''}{data.pct}%)
                  </p>
                </div>
                <div className={cn("px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border", 
                  data.trend === 'BULLISH' ? "bg-emerald-950/30 text-emerald-400 border-emerald-900/50" : 
                  data.trend === 'BEARISH' ? "bg-red-950/30 text-red-400 border-red-900/50" : 
                  "bg-yellow-950/30 text-yellow-500 border-yellow-900/50"
                )}>
                  {data.trend}
                </div>
              </div>

              {/* PCR and Max Pain */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="bg-[#1a1c21] p-2 rounded border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-500">
                    <Activity className="w-3 h-3 text-blue-400" />
                    <span className="text-[9px] uppercase tracking-widest font-bold">NET PCR</span>
                  </div>
                  <p className="text-sm font-bold font-mono text-white">{data.pcr.toFixed(2)}</p>
                </div>
                <div className="bg-[#1a1c21] p-2 rounded border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-500">
                    <Crosshair className="w-3 h-3 text-indigo-400" />
                    <span className="text-[9px] uppercase tracking-widest font-bold">MAX PAIN</span>
                  </div>
                  <p className="text-sm font-bold font-mono text-white">{data.maxPain.toLocaleString()}</p>
                </div>
              </div>

              {/* Support/Resistance */}
              <div className="space-y-2 mt-2 flex-1 flex flex-col justify-end bg-[#1a1c21] p-2 rounded border border-slate-800">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold border-b border-slate-800 pb-1.5 mb-1">High OI Levels</div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">R2 (Resistance)</span>
                    <span className="font-mono font-bold text-emerald-400">{data.res2.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-[3px]"><div className="bg-emerald-500 h-[3px] rounded-full" style={{width:'85%'}}></div></div>
                </div>
                
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">R1 (Immediate Res)</span>
                    <span className="font-mono font-bold text-emerald-400/80">{data.res1.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-[3px]"><div className="bg-emerald-500/80 h-[3px] rounded-full" style={{width:'60%'}}></div></div>
                </div>

                 <div className="py-1 flex items-center justify-center border-y border-slate-800/50 my-1.5 bg-slate-900/30 rounded">
                   <span className="text-[9px] uppercase tracking-widest text-blue-400 font-bold font-mono">Spot: {data.spot.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                 </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">S1 (Immediate Sup)</span>
                    <span className="font-mono font-bold text-red-400/80">{data.sup1.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-[3px] flex justify-end"><div className="bg-red-500/80 h-[3px] rounded-full" style={{width:'70%'}}></div></div>
                </div>

                <div className="space-y-1.5 pt-0.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">S2 (Support)</span>
                    <span className="font-mono font-bold text-red-400">{data.sup2.toLocaleString()}</span>
                  </div>
                   <div className="w-full bg-slate-800 rounded-full h-[3px] flex justify-end"><div className="bg-red-500 h-[3px] rounded-full" style={{width:'90%'}}></div></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <Card className="bg-[#101114] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle>
              <span>Intraday PCR Trend</span>
            </CardTitle>
            <select
              value={activeChartAsset}
              onChange={(e) => setActiveChartAsset(e.target.value as keyof typeof INITIAL_ASSETS)}
              className="bg-[#1a1c21] border border-slate-800 text-[10px] text-white rounded px-2 py-1 outline-none focus:border-blue-500 cursor-pointer uppercase font-bold"
            >
              <option value="NIFTY">NIFTY 50</option>
              <option value="BANKNIFTY">BANKNIFTY</option>
              <option value="SENSEX">SENSEX</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={assets[activeChartAsset].pcrHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPcr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d0f12', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '4px', fontSize: '10px' }}
                    itemStyle={{ fontFamily: 'JetBrains Mono' }}
                  />
                  <Area type="monotone" dataKey="pcr" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPcr)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

