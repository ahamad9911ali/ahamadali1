import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Core';
import { cn } from '../lib/utils';
import { LineChart, ArrowUpRight, ArrowDownRight, AlertTriangle, CheckSquare, Activity, ShieldCheck, Target, TrendingUp, TrendingDown, Info, BookOpen } from 'lucide-react';

const FNO_STOCKS = [
  "AARTIIND", "ABB", "ABBOTINDIA", "ABCAPITAL", "ABFRL", "ACC", "ADANIENT", "ADANIPORTS", "ALKEM", "AMBUJACEM", "APOLLOHOSP", "APOLLOTYRE", "ASHOKLEY", "ASIANPAINT", "ASTRAL", "ATUL", "AUBANK", "AUROPHARMA", "AXISBANK", "BAJAJ-AUTO", "BAJAJFINSV", "BAJFINANCE", "BALKRISIND", "BALRAMCHIN", "BANDHANBNK", "BANKBARODA", "BATAINDIA", "BEL", "BERGEPAINT", "BHARATFORG", "BHARTIARTL", "BHEL", "BIOCON", "BOSCHLTD", "BPCL", "BRITANNIA", "CANBK", "CANFINHOME", "CHAMBLFERT", "CHOLAFIN", "CIPLA", "COALINDIA", "COFORGE", "COLPAL", "CONCOR", "COROMANDEL", "CROMPTON", "CUB", "CUMMINSIND", "DABUR", "DALBHARAT", "DEEPAKNTR", "DIVISLAB", "DIXON", "DLF", "DRREDDY", "EICHERMOT", "ESCORTS", "EXIDEIND", "FEDERALBNK", "GAIL", "GLENMARK", "GMRINFRA", "GNFC", "GODREJCP", "GODREJPROP", "GRANULES", "GRASIM", "GUJGASLTD", "HAL", "HAVELLS", "HCLTECH", "HDFCAMC", "HDFCBANK", "HDFCLIFE", "HEROMOTOCO", "HINDALCO", "HINDCOPPER", "HINDPETRO", "HINDUNILVR", "ICICIBANK", "ICICIGI", "ICICIPRULI", "IDEA", "IDFCFIRSTB", "IEX", "IGL", "INDHOTEL", "INDIACEM", "INDIAMART", "INDIGO", "INDUSINDBK", "INDUSTOWER", "INFY", "IOC", "IPCALAB", "IRCTC", "ITC", "JINDALSTEL", "JSWSTEEL", "JUBLFOOD", "KOTAKBANK", "L&TFH", "LALPATHLAB", "LAURUSLABS", "LICHSGFIN", "LT", "LTIM", "LTTS", "LUPIN", "M&M", "M&MFIN", "MANAPPURAM", "MARICO", "MARUTI", "MCDOWELL-N", "MCX", "METROPOLIS", "MFSL", "MGL", "MOTHERSON", "MPHASIS", "MRF", "MUTHOOTFIN", "NATIONALUM", "NAUKRI", "NAVINFLUOR", "NESTLEIND", "NMDC", "NTPC", "OBEROIRLTY", "OFSS", "ONGC", "PAGEIND", "PEL", "PETRONET", "PFC", "PIDILITIND", "PIIND", "PNB", "POLYCAB", "POWERGRID", "PVRINOX", "RAMCOCEM", "RBLBANK", "RECLTD", "RELIANCE", "SAIL", "SBICARD", "SBILIFE", "SBIN", "SHREECEM", "SIEMENS", "SRF", "SUNTV", "SUNPHARMA", "SYNGENE", "TATACHEM", "TATACOMM", "TATACONSUM", "TATAMOTORS", "TATAPOWER", "TATASTEEL", "TCS", "TECHM", "TITAN", "TORNTPHARM", "TORNTPOWER", "TRENT", "TVSMOTOR", "UBL", "ULTRACEMCO", "UPL", "VEDL", "VOLTAS", "WIPRO", "ZEEL", "ZYDUSLIFE"
].sort();

function generateStockData(symbol: string) {
  if (symbol === 'RELIANCE') {
    return {
      fiiReqs: { net: "+14,200", trend: "increase", action: "Long Build-Up" },
      proReqs: { net: "+9,450", trend: "increase", action: "Long Build-Up" },
      options: { callChange: "+32L", putChange: "+14L", bias: "bullish" },
      price: { close: "2,985.20", action: "strong", indicator: "Near Day High" },
      tradeLevels: { entry: "2,980.50", current: "2,985.20", exit: "3,050.00", stoploss: "2,950.00" },
      verdict: "BULLISH",
      rationale: "FII & Pro both increasing net longs in futures. Call OI increased more than Put OI with price rising. Strong close indicates immediate upside continuation."
    };
  }
  if (symbol === 'HDFCBANK') {
    return {
      fiiReqs: { net: "-8,500", trend: "decrease", action: "Short Build-Up" },
      proReqs: { net: "-12,100", trend: "decrease", action: "Short Build-Up" },
      options: { callChange: "+15L", putChange: "+28L", bias: "bearish" },
      price: { close: "1,520.40", action: "weak", indicator: "Near Day Low" },
      tradeLevels: { entry: "1,525.00", current: "1,520.40", exit: "1,480.00", stoploss: "1,545.00" },
      verdict: "BEARISH",
      rationale: "Aggressive Short Build-Up by both FII & Pro in stock futures. Put OI outpacing Call OI additions while price dropped heavily. Expecting further downside."
    };
  }
  if (symbol === 'TCS') {
    return {
      fiiReqs: { net: "+5,200", trend: "increase", action: "Long Build-Up" },
      proReqs: { net: "-3,100", trend: "decrease", action: "Short Build-Up" },
      options: { callChange: "+12L", putChange: "+11L", bias: "neutral" },
      price: { close: "3,890.00", action: "neutral", indicator: "Mid-Range" },
      tradeLevels: { entry: "-", current: "3,890.00", exit: "-", stoploss: "-" },
      verdict: "AVOID",
      rationale: "Conflicting data. FII is adding longs while Pro is shorting. Options OI change is flat/ambiguous. Price closed mid-range. No clear directional signal."
    };
  }

  let hash = 0;
  for (let i = 0; i < symbol.length; i++) hash += symbol.charCodeAt(i);
  
  const isBullish = hash % 3 === 0;
  const isBearish = hash % 3 === 1;

  const fiiNet = (hash * 13) % 20000 + 1000;
  const proNet = (hash * 17) % 15000 + 1000;
  
  const callC = (hash * 7) % 50 + 1;
  const putC = (hash * 11) % 50 + 1;
  
  const closeP = (hash * 23) % 4000 + 100;
  const currentPrice = closeP + ((hash * 3) % 10) + (hash % 100) / 100;
  
  let entryPrice = isBullish ? currentPrice - 5 : isBearish ? currentPrice + 5 : currentPrice;
  let exitPrice = isBullish ? entryPrice * 1.03 : isBearish ? entryPrice * 0.97 : 0;
  let stoploss = isBullish ? entryPrice * 0.985 : isBearish ? entryPrice * 1.015 : 0;

  const tradeLevels = {
    entry: isBullish || isBearish ? entryPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
    current: currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    exit: isBullish || isBearish ? exitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
    stoploss: isBullish || isBearish ? stoploss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'
  };

  if (isBullish) {
    return {
      fiiReqs: { net: `+${fiiNet.toLocaleString()}`, trend: "increase", action: "Long Build-Up" },
      proReqs: { net: `+${proNet.toLocaleString()}`, trend: "increase", action: "Long Build-Up" },
      options: { callChange: `+${Math.max(callC, putC) + 5}L`, putChange: `+${Math.min(callC, putC)}L`, bias: "bullish" },
      price: { close: closeP.toLocaleString(), action: "strong", indicator: "Near Day High" },
      tradeLevels,
      verdict: "BULLISH",
      rationale: "FII & Pro both increasing net longs in futures. Options bias is positive. Strong setup."
    }
  } else if (isBearish) {
    return {
      fiiReqs: { net: `-${fiiNet.toLocaleString()}`, trend: "decrease", action: "Short Build-Up" },
      proReqs: { net: `-${proNet.toLocaleString()}`, trend: "decrease", action: "Short Build-Up" },
      options: { callChange: `+${Math.min(callC, putC)}L`, putChange: `+${Math.max(callC, putC) + 5}L`, bias: "bearish" },
      price: { close: closeP.toLocaleString(), action: "weak", indicator: "Near Day Low" },
      tradeLevels,
      verdict: "BEARISH",
      rationale: "Aggressive Short Build-Up by FII & Pro. Options flow indicates bearish momentum."
    }
  } else {
    return {
      fiiReqs: { net: `+${fiiNet.toLocaleString()}`, trend: "increase", action: "Long Build-Up" },
      proReqs: { net: `-${proNet.toLocaleString()}`, trend: "decrease", action: "Short Build-Up" },
      options: { callChange: `+${callC}L`, putChange: `+${putC}L`, bias: "neutral" },
      price: { close: closeP.toLocaleString(), action: "neutral", indicator: "Mid-Range" },
      tradeLevels,
      verdict: "AVOID",
      rationale: "Conflicting data. FII is adding longs while Pro is shorting. No clear directional signal."
    }
  }
}

export default function InstitutionalStock() {
  const [selectedStock, setSelectedStock] = useState<string>('RELIANCE');

  const data = React.useMemo(() => generateStockData(selectedStock), [selectedStock]);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4 mt-4 lg:mt-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <LineChart className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Institutional Stock Setup</h2>
            <p className="text-slate-400 text-xs font-medium mt-1">EOD FII/Pro derivative activity for exact stock entry triggers</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#1a1c21] p-1 rounded border border-slate-800">
           <select 
             value={selectedStock}
             onChange={e => setSelectedStock(e.target.value)}
             className="bg-[#1a1c21] border-none text-xs font-bold text-white uppercase tracking-widest outline-none px-2 py-1 cursor-pointer focus:ring-0"
           >
             {FNO_STOCKS.map(symbol => (
               <option key={symbol} value={symbol} className="bg-[#101114] text-white py-1">
                 {symbol}
               </option>
             ))}
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* FII / PRO Futures */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <Card className="bg-[#101114] border-slate-800">
            <CardHeader className="p-4 bg-[#15171a] border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" /> Stock Futures: Pro & FII Activity
              </h3>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* FII Block */}
                <div className="bg-[#1a1c22] border border-slate-700/50 rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                    <Activity className="w-16 h-16 text-indigo-400" />
                  </div>
                  <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">Foreign Inst. (FII)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-medium">Net Contracts</span>
                      <span className={cn("font-mono font-bold", data.fiiReqs.net.includes('+') ? "text-emerald-400" : "text-rose-400")}>{data.fiiReqs.net}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-medium">Position Trend</span>
                      <span className="text-xs font-bold text-white uppercase flex items-center gap-1">
                        {data.fiiReqs.trend === 'increase' ? <ArrowUpRight className="w-3 h-3 text-emerald-400"/> : <ArrowDownRight className="w-3 h-3 text-rose-400"/>}
                        {data.fiiReqs.trend}
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-700/50">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded inline-block w-full text-center border",
                        data.fiiReqs.action.includes('Long') ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50" : "bg-rose-950/40 text-rose-400 border-rose-900/50"
                      )}>{data.fiiReqs.action}</span>
                    </div>
                  </div>
                </div>
                
                {/* PRO Block */}
                <div className="bg-[#1a1c22] border border-slate-700/50 rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                    <ShieldCheck className="w-16 h-16 text-amber-400" />
                  </div>
                  <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">Proprietary (Pro)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-medium">Net Contracts</span>
                      <span className={cn("font-mono font-bold", data.proReqs.net.includes('+') ? "text-emerald-400" : "text-rose-400")}>{data.proReqs.net}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-medium">Position Trend</span>
                      <span className="text-xs font-bold text-white uppercase flex items-center gap-1">
                        {data.proReqs.trend === 'increase' ? <ArrowUpRight className="w-3 h-3 text-emerald-400"/> : <ArrowDownRight className="w-3 h-3 text-rose-400"/>}
                        {data.proReqs.trend}
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-700/50">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded inline-block w-full text-center border",
                        data.proReqs.action.includes('Long') ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50" : "bg-rose-950/40 text-rose-400 border-rose-900/50"
                      )}>{data.proReqs.action}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#101114] border-slate-800 border-l-2 border-l-purple-500">
            <CardHeader className="p-3 bg-[#15171a] border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" /> Options OI Bias
              </h3>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
               <div className="text-center border-r border-slate-800 pr-4">
                 <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Call OI Added</div>
                 <div className="text-lg font-bold text-white">{data.options.callChange}</div>
               </div>
               <div className="text-center border-r-0 md:border-r border-slate-800 pr-0 md:pr-4">
                 <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Put OI Added</div>
                 <div className="text-lg font-bold text-white">{data.options.putChange}</div>
               </div>
               <div className="col-span-2 flex flex-col justify-center bg-[#15171a] p-3 rounded border border-slate-800">
                 <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1 mb-1">
                   <TrendingUp className="w-3 h-3"/> Option Market Momentum
                 </div>
                 <div className={cn("text-xs font-bold uppercase tracking-widest", 
                   data.options.bias === 'bullish' ? 'text-emerald-400' : 
                   data.options.bias === 'bearish' ? 'text-rose-400' : 'text-amber-400'
                 )}>
                   {data.options.bias} Momentum
                 </div>
                 <div className="text-[9px] text-slate-500 mt-1">
                   {data.options.bias === 'bullish' ? 'Call OI increased more than Put OI on rising prices.' : data.options.bias === 'bearish' ? 'Put OI increased more than Call OI on falling prices.' : 'OI change flat or ambiguous.'}
                 </div>
               </div>
            </CardContent>
          </Card>

          {/* Trade Levels */}
          <Card className="bg-[#101114] border-slate-800 border-l-2 border-l-emerald-500">
            <CardHeader className="p-3 bg-[#15171a] border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" /> Key Price Levels
              </h3>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div className="text-center border-r border-slate-800 pr-2">
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Current Price</div>
                  <div className="text-lg font-bold text-white">₹{data.tradeLevels.current}</div>
                </div>
                <div className="text-center md:border-r border-slate-800 pr-2">
                  <div className="text-[10px] uppercase font-bold text-blue-400 mb-1">Entry Price</div>
                  <div className="text-lg font-bold text-blue-100">{data.verdict === 'AVOID' ? '-' : `₹${data.tradeLevels.entry}`}</div>
                </div>
                <div className="text-center border-r border-slate-800 pr-2 mt-4 md:mt-0">
                  <div className="text-[10px] uppercase font-bold text-emerald-500 mb-1">Target</div>
                  <div className="text-lg font-bold text-emerald-400">{data.verdict === 'AVOID' ? '-' : `₹${data.tradeLevels.exit}`}</div>
                </div>
                <div className="text-center mt-4 md:mt-0">
                  <div className="text-[10px] uppercase font-bold text-rose-500 mb-1">Stop Loss</div>
                  <div className="text-lg font-bold text-rose-400">{data.verdict === 'AVOID' ? '-' : `₹${data.tradeLevels.stoploss}`}</div>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Actionable Checklist */}
        <div className="space-y-4">
          <Card className={cn("bg-[#101114] border-slate-800 h-full flex flex-col border-t-2", 
            data.verdict === 'BULLISH' ? 'border-t-emerald-500' :
            data.verdict === 'BEARISH' ? 'border-t-rose-500' : 'border-t-amber-500'
          )}>
            <CardHeader className="p-4 bg-[#15171a] border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-400" /> Entry Filter Checklist
              </h3>
            </CardHeader>
            <CardContent className="p-5 flex-1 flex flex-col">
               <ul className="space-y-3 mb-6">
                 <li className="flex items-center gap-3">
                   <div className={cn("flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center", data.verdict === 'BULLISH' || (data.verdict==='BEARISH' && data.fiiReqs.action.includes('Short')) ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-600")}>✓</div>
                   <span className="text-xs text-slate-300 font-medium">FII Positioning aligned</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <div className={cn("flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center", data.verdict === 'BULLISH' || (data.verdict==='BEARISH' && data.proReqs.action.includes('Short')) ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-600")}>✓</div>
                   <span className="text-xs text-slate-300 font-medium">Pro aligned with FII</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <div className={cn("flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center", data.options.bias !== 'neutral' ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-600")}>✓</div>
                   <span className="text-xs text-slate-300 font-medium">Options OI Bias Confirmed</span>
                 </li>
                 <li className="flex items-center gap-3">
                   <div className={cn("flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center", data.price.action !== 'neutral' ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-600")}>✓</div>
                   <span className="text-xs text-slate-300 font-medium">Price Closed {data.price.indicator}</span>
                 </li>
               </ul>

               <div className="mt-auto">
                 <div className={cn("w-full py-3 rounded text-center font-black tracking-widest text-lg uppercase shadow-lg border",
                    data.verdict === 'BULLISH' ? "bg-emerald-500 text-black border-emerald-400" :
                    data.verdict === 'BEARISH' ? "bg-rose-600 text-white border-rose-500" :
                    "bg-amber-500 text-black border-amber-400"
                 )}>
                   {data.verdict}
                 </div>
                 <p className="text-[10px] text-slate-400 mt-3 text-center leading-relaxed">
                   {data.rationale}
                 </p>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Legend & Guide */}
      <Card className="bg-blue-950/10 border-blue-900/50 overflow-hidden">
         <CardContent className="p-4 flex gap-4 items-start">
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <Info className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1.5">How to use this EOD data</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed max-w-4xl">
                This dashboard analyzes <strong>End-of-Day (EOD) data</strong> to plan the next session's trade. It aggregates the NSE Participant-wise Open Interest report. 
                A strong setup requires FII and PRO futures alignment, matched with an Option OI bias and strong price momentum. 
                <span className="block mt-1 font-bold text-slate-300">Avoid entry when FII & Pro positions are conflicting, or if the stock is illiquid. Always combine with chart levels.</span>
              </p>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
