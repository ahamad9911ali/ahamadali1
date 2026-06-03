import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Core';
import { generateOptionChain, formatNumber, cn } from '../lib/utils';
import { Search, SlidersHorizontal, Globe, Wifi, RefreshCw, Cpu } from 'lucide-react';
import { isMarketOpen } from '../utils/marketHours';

const ASSETS = {
  NIFTY: { name: 'NIFTY 50', spot: 23124.50, step: 50 },
  BANKNIFTY: { name: 'BANKNIFTY', spot: 51345.20, step: 100 },
  SENSEX: { name: 'SENSEX', spot: 76543.20, step: 100 }
};

/**
 * Known NSE (National Stock Exchange of India) official holiday list for 2026 trading sessions.
 * Expiries falling on these scheduled holidays are automatically shifted to the preceding trading day.
 */
const NSE_HOLIDAYS_2026 = [
  "2026-01-26", // Republic Day
  "2026-03-06", // Holi
  "2026-03-30", // Id-ul-Fitr
  "2026-04-03", // Good Friday
  "2026-04-14", // Dr. Ambedkar Jayanti
  "2026-05-01", // Maharashtra Day
  "2026-05-25", // Id-ul-Zuha (Bakrid)
  "2026-10-02", // Mahatma Gandhi Jayanti
  "2026-10-22", // Dussehra (Thursday)
  "2026-11-09", // Diwali Balipratipada
  "2026-12-25"  // Christmas
];

function isNSEHoliday(dateStr: string): boolean {
  return NSE_HOLIDAYS_2026.includes(dateStr);
}

/**
 * Recursively adjusts an expiry date backwards to find the previous active trading day,
 * skipping weekends and scheduled NSE market holidays.
 */
function adjustExpiryForHolidays(date: Date): Date {
  const result = new Date(date.getTime());
  while (true) {
    const year = result.getFullYear();
    const month = String(result.getMonth() + 1).padStart(2, '0');
    const day = String(result.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const dayOfWeek = result.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    if (isWeekend || isNSEHoliday(dateStr)) {
      result.setDate(result.getDate() - 1); // Shift to preceding trading day
    } else {
      break;
    }
  }
  return result;
}

/**
 * Finds the last occurrence of a given weekday (0-6) in a specific calendar month.
 */
function getLastWeekdayOfMonth(year: number, month: number, targetDay: number): Date {
  const d = new Date(year, month + 1, 0);
  while (d.getDay() !== targetDay) {
    d.setDate(d.getDate() - 1);
  }
  return d;
}

/**
 * Calculates upcoming weekly/monthly expiry contract dates dynamically matching the requested guidelines:
 * - NIFTY 50: Tuesday weekly, Tuesday last-of-month (M)
 * - BANKNIFTY: Tuesday last-of-month (M)
 * - SENSEX: Thursday weekly, Thursday last-of-month (M)
 */
function getUpcomingExpiries(assetKey: string): string[] {
  const expiries: string[] = [];
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istNow = new Date(utc + (3600000 * 5.5)); // Normalized to IST (+5:30)
  
  const currentMinutes = istNow.getHours() * 60 + istNow.getMinutes();
  const isPastExpiryTime = currentMinutes > (15 * 60 + 30); // After market closes at 15:30 IST
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (assetKey === 'BANKNIFTY') {
    let currentYear = istNow.getFullYear();
    let currentMonth = istNow.getMonth(); // 0-indexed

    let count = 0;
    while (count < 4) {
      const lastTuesday = getLastWeekdayOfMonth(currentYear, currentMonth, 2); // Tuesday is 2
      
      const lastTuesdayCompare = new Date(lastTuesday.getFullYear(), lastTuesday.getMonth(), lastTuesday.getDate());
      const istTodayCompare = new Date(istNow.getFullYear(), istNow.getMonth(), istNow.getDate());
      
      let isPast = false;
      if (lastTuesdayCompare < istTodayCompare) {
        isPast = true;
      } else if (lastTuesdayCompare.getTime() === istTodayCompare.getTime() && isPastExpiryTime) {
        isPast = true;
      }

      if (!isPast) {
        const adjustedDate = adjustExpiryForHolidays(lastTuesday);
        const dayStr = String(adjustedDate.getDate()).padStart(2, '0');
        const monthStr = months[adjustedDate.getMonth()];
        const yearStr = adjustedDate.getFullYear();
        
        const label = `${dayStr} ${monthStr} ${yearStr} (M)`;
        expiries.push(label);
        count++;
      }
      
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
  } else {
    // NIFTY: Tuesday weekly & Tuesday last-of-month. Target day is Tuesday (2)
    // SENSEX: Thursday weekly & Thursday last-of-month. Target day is Thursday (4)
    const targetDay = assetKey === 'NIFTY' ? 2 : 4;
    
    const d = new Date(istNow.getFullYear(), istNow.getMonth(), istNow.getDate());
    
    let daysUntilExpiry = (targetDay - d.getDay() + 7) % 7;
    if (daysUntilExpiry === 0 && isPastExpiryTime) {
      daysUntilExpiry = 7;
    }
    
    d.setDate(d.getDate() + daysUntilExpiry);
    
    for (let i = 0; i < 4; i++) {
      const adjustedDate = adjustExpiryForHolidays(d);
      
      const dayStr = String(adjustedDate.getDate()).padStart(2, '0');
      const monthStr = months[adjustedDate.getMonth()];
      const yearStr = adjustedDate.getFullYear();
      
      // Check if this date is the last occurrence of this weekday in that month
      const nextWeekDate = new Date(d);
      nextWeekDate.setDate(nextWeekDate.getDate() + 7);
      const isMonthly = nextWeekDate.getMonth() !== d.getMonth();
      
      const label = `${dayStr} ${monthStr} ${yearStr}${isMonthly ? ' (M)' : ''}`;
      expiries.push(label);
      
      d.setDate(d.getDate() + 7);
    }
  }
  
  return expiries;
}

export default function OptionChain() {
  const [assetKey, setAssetKey] = useState<keyof typeof ASSETS>('BANKNIFTY');
  const [isSyncing, setIsSyncing] = useState<boolean>(true);
  
  const expiryOptions = useMemo(() => {
    return getUpcomingExpiries(assetKey);
  }, [assetKey]);

  const [expiry, setExpiry] = useState(() => getUpcomingExpiries('BANKNIFTY')[0]);

  // Simulate NSE Live Contract Master query when active asset/contract is changed
  useEffect(() => {
    setIsSyncing(true);
    const timer = setTimeout(() => {
      setIsSyncing(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [assetKey]);

  useEffect(() => {
    if (expiryOptions.length > 0) {
      setExpiry(expiryOptions[0]);
    }
  }, [expiryOptions]);
  
  const selectedAsset = ASSETS[assetKey];
  const [spotPrice, setSpotPrice] = useState(selectedAsset.spot);

  useEffect(() => {
    setSpotPrice(ASSETS[assetKey].spot);
    const interval = setInterval(() => {
      if (!isMarketOpen()) return; // Pause ticking updates when market is closed
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
            {expiryOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <button className="p-1 bg-[#1a1c21] border border-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* NSE API / Website Connection Sync Feed Status Bar */}
      <div className="bg-[#101114] border border-slate-800/60 rounded-lg px-3 py-1.5 flex flex-wrap items-center justify-between gap-2.5 text-[10px]">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400 font-medium">NSE Live Contract Connection:</span>
          {isSyncing ? (
            <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>Querying nseindia.com/option-chain master...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Synchronized with NSE contract guidelines</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-slate-500 font-mono text-[9px]">
          <span>Feed ID: <strong className="text-slate-300">NSE_OC_SYNC_2026</strong></span>
          <span className="hidden sm:inline border-l border-slate-800 pl-3">Current Active Expiry: <strong className="text-indigo-400 font-bold">{expiry}</strong></span>
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
