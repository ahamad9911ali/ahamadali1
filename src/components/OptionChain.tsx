import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Core';
import { generateOptionChain, formatNumber, cn } from '../lib/utils';
import { Search, SlidersHorizontal } from 'lucide-react';

const ASSETS = {
  NIFTY: { name: 'NIFTY 50', spot: 23124.50, step: 50 },
  BANKNIFTY: { name: 'BANKNIFTY', spot: 51345.20, step: 100 },
  SENSEX: { name: 'SENSEX', spot: 76543.20, step: 100 }
};

export default function OptionChain() {
  const [assetKey, setAssetKey] = useState<keyof typeof ASSETS>('BANKNIFTY');
  const [expiry, setExpiry] = useState('04 Jun 2026');
  
  const selectedAsset = ASSETS[assetKey];
  const [spotPrice, setSpotPrice] = useState(selectedAsset.spot);

  useEffect(() => {
    setSpotPrice(ASSETS[assetKey].spot);
    const interval = setInterval(() => {
      setSpotPrice(prev => prev + ((Math.random() * 8) - 4));
    }, 1500);
    return () => clearInterval(interval);
  }, [assetKey]);
  
  // Generate realistic looking mock data for UI visualization around Spot Price
  const chainData = useMemo(() => generateOptionChain(selectedAsset.spot, selectedAsset.step), [assetKey]);

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-sm font-bold text-white">Option Flow Analysis - {selectedAsset.name}</h2>
          <p className="text-[10px] text-slate-500 mt-0.5"><span className="text-emerald-400">CE</span> vs <span className="text-red-400">PE</span> Open Interest</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-[#1a1c21] border border-slate-800 rounded px-2 py-1 flex items-center">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider mr-1.5 font-bold">Spot: </span>
            <span className="font-mono text-[11px] text-white font-bold">{spotPrice.toFixed(2)}</span>
          </div>
          <select
            value={assetKey}
            onChange={e => setAssetKey(e.target.value as keyof typeof ASSETS)}
            className="bg-[#1a1c21] border border-slate-800 text-[10px] text-emerald-400 rounded px-2 py-1 outline-none focus:border-blue-500 cursor-pointer uppercase font-bold"
          >
            <option value="NIFTY">NIFTY 50</option>
            <option value="BANKNIFTY">BANKNIFTY</option>
            <option value="SENSEX">SENSEX</option>
          </select>
          <select 
            value={expiry} 
            onChange={e => setExpiry(e.target.value)}
            className="bg-[#1a1c21] border border-slate-800 text-[10px] text-white rounded px-2 py-1 outline-none focus:border-blue-500 cursor-pointer uppercase font-bold"
          >
            <option>04 Jun 2026</option>
            <option>11 Jun 2026</option>
            <option>18 Jun 2026</option>
            <option>25 Jun 2026 (M)</option>
          </select>
          <button className="p-1 bg-[#1a1c21] border border-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <Card className="border-slate-800 overflow-hidden text-[11px] bg-[#101114]">
        <div className="grid grid-cols-12 bg-slate-800/80 border-b border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
          {/* CALLS HEADER */}
          <div className="col-span-12 md:col-span-5 grid grid-cols-5 py-2 border-b md:border-b-0 md:border-r border-slate-700">
            <div className="text-center col-span-5 pb-1 mb-1 border-b border-slate-700 text-emerald-400 tracking-widest">Calls (CE)</div>
            <div className="px-1">OI(L)</div>
            <div className="px-1">Chng</div>
            <div className="px-1">Vol</div>
            <div className="px-1">IV</div>
            <div className="px-1 text-white">LTP</div>
          </div>
          
          {/* STRIKE HEADER */}
          <div className="col-span-12 md:col-span-2 flex items-center justify-center py-2 bg-slate-700 font-bold text-white tracking-widest">
            STRIKE
          </div>

          {/* PUTS HEADER */}
          <div className="col-span-12 md:col-span-5 grid grid-cols-5 py-2 border-t md:border-t-0 md:border-l border-slate-700">
            <div className="text-center col-span-5 pb-1 mb-1 border-b border-slate-700 text-red-400 tracking-widest">Puts (PE)</div>
            <div className="px-1 text-white">LTP</div>
            <div className="px-1">IV</div>
            <div className="px-1">Vol</div>
            <div className="px-1">Chng</div>
            <div className="px-1">OI(L)</div>
          </div>
        </div>

        <div className="font-mono divide-y divide-slate-800/50">
          {chainData.map((row, idx) => {
            const isITM_CE = row.strike < spotPrice;
            const isITM_PE = row.strike > spotPrice;
            const isATM = Math.abs(row.strike - spotPrice) <= (selectedAsset.step / 2);
            
            return (
              <div 
                key={idx} 
                className={cn(
                  "grid grid-cols-12 hover:bg-slate-800/40 text-center items-center py-1.5 transition-colors",
                  isATM && "bg-slate-700/20 border-y border-slate-600/30"
                )}
              >
                {/* CALLS DATA */}
                <div className={cn("col-span-12 md:col-span-5 grid grid-cols-5 md:border-r border-slate-800 py-0.5", isITM_CE ? "bg-emerald-950/10" : "")}>
                  <div className="px-1 text-slate-300">{(row.ce.oi/100000).toFixed(2)}</div>
                  <div className={cn("px-1", row.ce.oiChange > 0 ? "text-emerald-400" : "text-red-400")}>{(row.ce.oiChange > 0 ? '+' : '')}{formatNumber(row.ce.oiChange)}</div>
                  <div className="px-1 text-slate-500">{formatNumber(row.ce.volume)}</div>
                  <div className="px-1 text-slate-500">{row.ce.iv.toFixed(1)}</div>
                  <div className="px-1 font-bold text-emerald-400">{row.ce.ltp.toFixed(2)}</div>
                </div>

                {/* STRIKE DATA */}
                <div className="col-span-12 md:col-span-2 flex flex-col items-center justify-center bg-slate-900/50 border-x border-slate-800 py-1 font-bold text-[11px] text-white">
                  <span className={cn(isATM ? "text-yellow-500" : "text-white")}>
                    {row.strike} {isATM && <span className="font-sans text-[8px] tracking-widest">(ATM)</span>}
                  </span>
                </div>

                {/* PUTS DATA */}
                <div className={cn("col-span-12 md:col-span-5 grid grid-cols-5 md:border-l border-slate-800 py-0.5", isITM_PE ? "bg-red-950/10" : "")}>
                  <div className="px-1 font-bold text-red-400">{row.pe.ltp.toFixed(2)}</div>
                  <div className="px-1 text-slate-500">{row.pe.iv.toFixed(1)}</div>
                  <div className="px-1 text-slate-500">{formatNumber(row.pe.volume)}</div>
                  <div className={cn("px-1", row.pe.oiChange > 0 ? "text-emerald-400" : "text-red-400")}>{(row.pe.oiChange > 0 ? '+' : '')}{formatNumber(row.pe.oiChange)}</div>
                  <div className="px-1 text-slate-300">{(row.pe.oi/100000).toFixed(2)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
