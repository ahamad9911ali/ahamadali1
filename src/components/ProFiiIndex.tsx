import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Core';
import { cn } from '../lib/utils';
import { LineChart, ArrowUpRight, ArrowDownRight, Activity, ShieldCheck, Target, TrendingUp, CheckSquare, Info, AlertTriangle } from 'lucide-react';

const INDEX_DATA = {
  NIFTY: {
    spot: 24200,
    change: "+0.8%",
    fiiReqs: { net: "+8,000", trend: "increase", action: "Long Build-Up" },
    proReqs: { net: "+3,500", trend: "increase", action: "Long Build-Up" },
    options: { callChange: "+12,000", putChange: "+4,000", bias: "Bullish (Calls added > Puts)" },
    priceClose: "Above previous high",
    verdict: "BULL CALL SPREAD",
    strategy: "Buy ATM Call, Sell OTM Call",
    rationale: "Smart money positioned bullish. FII and Pro both added long positions in Index Futures. Call OI increased significantly more than Put OI, indicating bullish spreads. Market closing strong confirms momentum."
  },
  BANKNIFTY: {
    spot: 52100,
    change: "-1.2%",
    fiiReqs: { net: "-15,000", trend: "decrease", action: "Short Build-Up" },
    proReqs: { net: "-8,200", trend: "decrease", action: "Short Build-Up" },
    options: { callChange: "+5,000", putChange: "+18,000", bias: "Bearish (Puts added > Calls)" },
    priceClose: "Below previous low",
    verdict: "BEAR PUT SPREAD",
    strategy: "Buy ATM Put, Sell OTM Put",
    rationale: "Smart money positioned bearish. FII and Pro both added short positions in Index Futures. Put OI increased more than Call OI, suggesting hedged shorting or bearish spreads."
  },
  FINNIFTY: {
    spot: 23500,
    change: "+0.1%",
    fiiReqs: { net: "-2,000", trend: "decrease", action: "Short Build-Up" },
    proReqs: { net: "+1,500", trend: "increase", action: "Long Build-Up" },
    options: { callChange: "+25,000", putChange: "+22,000", bias: "Neutral (Heavy both sides)" },
    priceClose: "Inside previous day range",
    verdict: "IRON CONDOR",
    strategy: "Sell OTM Call & Sell OTM Put",
    rationale: "Pro vs FII conflict. FII is short while Pro is long. Both calls and puts seeing heavy OI addition, suggesting aggressive option selling on both sides. Market expected to remain range-bound."
  },
  SENSEX: {
    spot: 76500,
    change: "+0.4%",
    fiiReqs: { net: "+5,400", trend: "increase", action: "Long Build-Up" },
    proReqs: { net: "+2,100", trend: "increase", action: "Long Build-Up" },
    options: { callChange: "+8,000", putChange: "+3,500", bias: "Bullish (Calls added > Puts)" },
    priceClose: "Above previous high",
    verdict: "BULL CALL SPREAD",
    strategy: "Buy ATM Call, Sell OTM Call",
    rationale: "Smart money positioned bullish. FII and Pro both added long positions in Index Futures. Call OI increased significantly more than Put OI, indicating bullish spreads."
  }
};

export default function ProFiiIndex() {
  const [selectedIndex, setSelectedIndex] = useState<keyof typeof INDEX_DATA>('NIFTY');
  
  const data = INDEX_DATA[selectedIndex];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4 mt-4 lg:mt-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <LineChart className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Index Strategy Builder</h2>
            <p className="text-slate-400 text-xs font-medium mt-1">EOD structural analysis for high-probability index option trades</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#1a1c21] p-1 rounded border border-slate-800">
           <select 
             value={selectedIndex}
             onChange={e => setSelectedIndex(e.target.value as keyof typeof INDEX_DATA)}
             className="bg-[#1a1c21] border-none text-xs font-bold text-white uppercase tracking-widest outline-none px-2 py-1 cursor-pointer focus:ring-0"
           >
             <option value="NIFTY" className="bg-[#101114] text-white">NIFTY 50</option>
             <option value="BANKNIFTY" className="bg-[#101114] text-white">BANKNIFTY</option>
             <option value="FINNIFTY" className="bg-[#101114] text-white">FINNIFTY</option>
             <option value="SENSEX" className="bg-[#101114] text-white">SENSEX</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* FII / PRO Futures Analysis */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <Card className="bg-[#101114] border-slate-800">
            <CardHeader className="p-4 bg-[#15171a] border-b border-slate-800">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" /> Index Futures: Smart Money View
                </h3>
                <div className="text-xs font-bold font-mono">
                  <span className="text-slate-400">SPOT: </span>
                  <span className="text-white">{data.spot}</span>
                  <span className={cn("ml-2", data.change.startsWith('+') ? "text-emerald-400" : "text-rose-400")}>({data.change})</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* FII Block */}
                <div className="bg-[#1a1c22] border border-slate-700/50 rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                    <Activity className="w-16 h-16 text-indigo-400" />
                  </div>
                  <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">FII Index Futures</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-medium">Net Contracts Chg</span>
                      <span className={cn("font-mono font-bold", data.fiiReqs.net.includes('+') ? "text-emerald-400" : "text-rose-400")}>{data.fiiReqs.net}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-medium">Market Action</span>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                        data.fiiReqs.action.includes('Long') ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50" : "bg-rose-950/40 text-rose-400 border border-rose-900/50"
                      )}>{data.fiiReqs.action}</span>
                    </div>
                  </div>
                </div>
                
                {/* PRO Block */}
                <div className="bg-[#1a1c22] border border-slate-700/50 rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                    <ShieldCheck className="w-16 h-16 text-amber-400" />
                  </div>
                  <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">Pro Index Futures</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-medium">Net Contracts Chg</span>
                      <span className={cn("font-mono font-bold", data.proReqs.net.includes('+') ? "text-emerald-400" : "text-rose-400")}>{data.proReqs.net}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-medium">Market Action</span>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                        data.proReqs.action.includes('Long') ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50" : "bg-rose-950/40 text-rose-400 border border-rose-900/50"
                      )}>{data.proReqs.action}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#101114] border-slate-800">
            <CardHeader className="p-3 bg-[#15171a] border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" /> Combined Options OI Activity (FII + Pro)
              </h3>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
               <div className="text-center md:border-r border-slate-800 md:pr-4 order-2 md:order-1">
                 <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Call OI Added</div>
                 <div className="text-lg font-bold text-white tracking-widest font-mono">{data.options.callChange}</div>
               </div>
               <div className="col-span-2 flex flex-col justify-center bg-[#15171a] p-3 rounded border border-slate-800 order-1 md:order-2">
                 <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1 mb-1">
                   <Target className="w-3 h-3"/> Options Flow Bias
                 </div>
                 <div className={cn("text-xs font-bold uppercase tracking-widest", 
                   data.options.bias.includes('Bullish') ? 'text-emerald-400' : 
                   data.options.bias.includes('Bearish') ? 'text-rose-400' : 'text-amber-400'
                 )}>
                   {data.options.bias}
                 </div>
               </div>
               <div className="text-center md:border-l border-slate-800 md:pl-4 order-3">
                 <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Put OI Added</div>
                 <div className="text-lg font-bold text-white tracking-widest font-mono">{data.options.putChange}</div>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Actionable Strategy Setup */}
        <div className="space-y-4">
          <Card className={cn("bg-[#101114] border-slate-800 h-full flex flex-col border-t-2", 
            data.verdict.includes('BULL') ? 'border-t-emerald-500' :
            data.verdict.includes('BEAR') ? 'border-t-rose-500' : 'border-t-amber-500'
          )}>
            <CardHeader className="p-4 bg-[#15171a] border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-400" /> EOD Strategy Formulation
              </h3>
            </CardHeader>
            <CardContent className="p-5 flex-1 flex flex-col">
               <div className="space-y-3 mb-6">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">FII & Pro Align</span>
                    {data.fiiReqs.action === data.proReqs.action ? 
                      <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckSquare className="w-3 h-3" /> Yes</span> :
                      <span className="text-amber-400 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Divergent</span>
                    }
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Spot Price Action</span>
                    <span className="text-white font-medium">{data.priceClose}</span>
                 </div>
               </div>

               <div className="mt-auto">
                 <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Recommended Setup</div>
                 <div className={cn("w-full py-4 rounded-t text-center font-black tracking-widest text-lg uppercase shadow-lg border-x border-t",
                    data.verdict.includes('BULL') ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                    data.verdict.includes('BEAR') ? "bg-rose-500/10 text-rose-400 border-rose-500/30" :
                    "bg-amber-500/10 text-amber-400 border-amber-500/30"
                 )}>
                   {data.verdict}
                 </div>
                 <div className={cn("w-full py-2 rounded-b text-center text-xs font-bold tracking-widest uppercase border-x border-b",
                    data.verdict.includes('BULL') ? "bg-emerald-500 text-black border-emerald-400" :
                    data.verdict.includes('BEAR') ? "bg-rose-600 text-white border-rose-500" :
                    "bg-amber-500 text-black border-amber-400"
                 )}>
                   {data.strategy}
                 </div>
                 
                 <p className="text-[10px] text-slate-400 mt-4 text-center leading-relaxed">
                   {data.rationale}
                 </p>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Guide/Cheat Sheet */}
      <Card className="bg-blue-950/10 border-blue-900/50 overflow-hidden">
         <CardContent className="p-4 flex gap-4 items-start">
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <Info className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1 text-xs text-slate-300 leading-relaxed max-w-4xl">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Index Options Core Rules</h4>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
                <li><strong className="text-emerald-400">Bullish Signal:</strong> FII & Pro net longs increase. Call OI increases substantially more than Put OI. Strategy: <em>Bull Call Spread</em></li>
                <li><strong className="text-rose-400">Bearish Signal:</strong> FII & Pro net shorts increase. Put OI increases substantially more than Call OI. Strategy: <em>Bear Put Spread</em></li>
                <li><strong className="text-amber-400">Sideways/Conflict:</strong> FII & Pro have opposing views, or high OI addition on both Call and Put strikes. Strategy: <em>Iron Condor or Short Strangle</em></li>
                <li><strong>Validation:</strong> Always validate these EOD smart money footprints against next day's spot price action. Do not trade options purely on OI independently.</li>
              </ul>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
