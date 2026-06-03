import React, { useState, useEffect } from 'react';
import { Clock, HelpCircle } from 'lucide-react';
import { getISTDateTime, isMarketOpen, getMarketStatusExplanation } from '../utils/marketHours';
import { cn } from '../lib/utils';

export default function MarketStatusHeader() {
  const [ist, setIst] = useState(getISTDateTime());
  const [marketOpen, setMarketOpen] = useState(isMarketOpen());
  const [explanation, setExplanation] = useState(getMarketStatusExplanation());
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Sync time every second
    const interval = setInterval(() => {
      setIst(getISTDateTime());
      setMarketOpen(isMarketOpen());
      setExplanation(getMarketStatusExplanation());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-[#101114] border border-slate-800/80 rounded-lg p-2.5 flex flex-wrap gap-3 items-center justify-between text-xs transition-all duration-300">
      {/* Time and Date */}
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-slate-900 rounded border border-slate-800/50 text-slate-400 flex items-center justify-center">
          <Clock className="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-white tracking-tight">{ist.timeString}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider bg-slate-900/60 px-1 py-0.5 rounded border border-slate-800/40">IST</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">{ist.fullDateString}</p>
        </div>
      </div>

      {/* Market Status Alert */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Broker connected */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold border bg-emerald-950/20 text-emerald-400 border-emerald-900/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">BROKER TERMINAL:</span> 
          <select 
            className="bg-transparent outline-none cursor-pointer text-emerald-400 font-bold border-none p-0 focus:ring-0 leading-none h-auto"
            defaultValue="Dhan"
          >
            <option className="bg-[#101114] text-white">Dhan</option>
            <option className="bg-[#101114] text-white">Zerodha Kite</option>
            <option className="bg-[#101114] text-white">Upstox</option>
            <option className="bg-[#101114] text-white">Angel One</option>
            <option className="bg-[#101114] text-white">Fyers</option>
            <option className="bg-[#101114] text-white">Shoonya (Finvasia)</option>
          </select>
        </div>

        {/* Live connected */}
        <a href="https://www.nseindia.com/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold border bg-blue-950/20 text-blue-400 border-blue-900/50 hover:bg-blue-900/30 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          LIVE DATA CONNECTED: NSEINDIA.COM
        </a>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold border",
            marketOpen
              ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/50"
              : "bg-rose-950/10 text-rose-400 border-rose-900/30"
          )}>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              marketOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
            )} />
            {marketOpen ? 'NSE MARKET OPEN' : 'NSE MARKET CLOSED'}
          </div>

          <div className="relative">
            <button 
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              className="p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-help"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
            {showTooltip && (
              <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-[#15171a] border border-slate-800 p-2.5 rounded-md shadow-xl text-[10px] text-slate-400 font-normal leading-relaxed">
                <span className="font-bold text-white block mb-1">Indian Market Hours (IST)</span>
                Standard trading occurs Monday to Friday from <strong className="text-white font-mono">09:15 AM</strong> to <strong className="text-white font-mono">03:30 PM</strong> IST. Ticks & live data inputs are constrained to this slot.
              </div>
            )}
          </div>
        </div>

        {/* Status Explanation */}
        <span className="text-[10px] text-slate-400 font-medium hidden sm:inline border-l border-slate-800 pl-3">
          {explanation.reason} • <span className="text-slate-500">Next: {explanation.nextSession}</span>
        </span>
      </div>
    </div>
  );
}
