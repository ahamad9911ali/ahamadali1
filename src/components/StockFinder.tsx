import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Core';
import { Search, TrendingUp, TrendingDown, Filter, Zap, Eye } from 'lucide-react';
import { cn } from '../lib/utils';

interface StockData {
  symbol: string;
  name: string;
  category: 'NIFTY500' | 'FNO';
  tradeMode: 'INTRADAY' | 'SWING';
  ltp: number;
  change: number;
  pct: number;
  volumeMultiplier: number;
  momentumScore: number;
  fiiActivity: 'BUYING' | 'SELLING' | 'NEUTRAL';
  proActivity: 'BUYING' | 'SELLING' | 'NEUTRAL';
  signal: 'STRONG BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG SELL';
  signalTime: string;
}

const generateMockStocks = (): StockData[] => {
  const baseSymbols = [
    { s: 'RELIANCE', n: 'Reliance Industries Ltd' }, { s: 'TCS', n: 'Tata Consultancy Services Ltd' },
    { s: 'HDFCBANK', n: 'HDFC Bank Ltd' }, { s: 'ICICIBANK', n: 'ICICI Bank Ltd' },
    { s: 'BHARTIARTL', n: 'Bharti Airtel Ltd' }, { s: 'SBIN', n: 'State Bank of India' },
    { s: 'INFY', n: 'Infosys Ltd' }, { s: 'L&T', n: 'Larsen & Toubro Ltd' },
    { s: 'ITC', n: 'ITC Ltd' }, { s: 'BAJFINANCE', n: 'Bajaj Finance Ltd' },
    { s: 'TATAMOTORS', n: 'Tata Motors Ltd' }, { s: 'SUNPHARMA', n: 'Sun Pharmaceutical' },
    { s: 'NTPC', n: 'NTPC Ltd' }, { s: 'KOTAKBANK', n: 'Kotak Mahindra Bank' },
    { s: 'AXISBANK', n: 'Axis Bank Ltd' }, { s: 'ONGC', n: 'Oil & Natural Gas Corp' },
    { s: 'M&M', n: 'Mahindra & Mahindra' }, { s: 'MARUTI', n: 'Maruti Suzuki India' },
    { s: 'ULTRACEMCO', n: 'UltraTech Cement' }, { s: 'TITAN', n: 'Titan Company' },
    { s: 'ASIANPAINT', n: 'Asian Paints Ltd' }, { s: 'POWERGRID', n: 'Power Grid Corp' },
    { s: 'BAJAJFINSV', n: 'Bajaj Finserv Ltd' }, { s: 'HCLTECH', n: 'HCL Technologies' },
    { s: 'JSWSTEEL', n: 'JSW Steel Ltd' }, { s: 'TATASTEEL', n: 'Tata Steel Ltd' },
    { s: 'ADANIENT', n: 'Adani Enterprises' }, { s: 'ADANIPORTS', n: 'Adani Ports & SEZ' },
    { s: 'GRASIM', n: 'Grasim Industries' }, { s: 'TECHM', n: 'Tech Mahindra Ltd' },
    { s: 'WIPRO', n: 'Wipro Ltd' }, { s: 'HINDUNILVR', n: 'Hindustan Unilever' },
    { s: 'NESTLEIND', n: 'Nestle India' }, { s: 'APOLLOHOSP', n: 'Apollo Hospitals' },
    { s: 'CIPLA', n: 'Cipla Ltd' }, { s: 'HINDALCO', n: 'Hindalco Industries' },
    { s: 'DRREDDY', n: 'Dr. Reddy\'s Labs' }, { s: 'EICHERMOT', n: 'Eicher Motors' },
    { s: 'BAJAJ-AUTO', n: 'Bajaj Auto Ltd' }, { s: 'INDUSINDBK', n: 'IndusInd Bank' },
    { s: 'TRENT', n: 'Trent Ltd' }, { s: 'BRITANNIA', n: 'Britannia Industries' },
    { s: 'COALINDIA', n: 'Coal India Ltd' }, { s: 'HEROMOTOCO', n: 'Hero MotoCorp' },
    { s: 'ZOMATO', n: 'Zomato Ltd' }, { s: 'PAYTM', n: 'One97 Communications' },
    { s: 'JIOFIN', n: 'Jio Financial Services' }, { s: 'HAL', n: 'Hindustan Aeronautics' },
    { s: 'BEL', n: 'Bharat Electronics' }, { s: 'IRFC', n: 'Indian Railway Fin Corp' },
    { s: 'RVNL', n: 'Rail Vikas Nigam' }, { s: 'SUZLON', n: 'Suzlon Energy' },
    { s: 'IREDA', n: 'IREDA Ltd' }, { s: 'NHPC', n: 'NHPC Ltd' },
    { s: 'BHEL', n: 'Bharat Heavy Electricals' }, { s: 'IDEA', n: 'Vodafone Idea Ltd' },
    { s: 'YESBANK', n: 'Yes Bank Ltd' }, { s: 'PNB', n: 'Punjab National Bank' },
    { s: 'BOB', n: 'Bank of Baroda' }, { s: 'CANBK', n: 'Canara Bank' },
    { s: 'IDFCFIRSTB', n: 'IDFC First Bank' }, { s: 'UNIONBANK', n: 'Union Bank of India' },
    { s: 'IOB', n: 'Indian Overseas Bank' }, { s: 'UCOBANK', n: 'UCO Bank' },
    { s: 'CENTRALBK', n: 'Central Bank of India' }, { s: 'BANKINDIA', n: 'Bank of India' },
    { s: 'AWL', n: 'Adani Wilmar Ltd' }, { s: 'ATGL', n: 'Adani Total Gas Ltd' },
    { s: 'ABB', n: 'ABB India Ltd' }, { s: 'BOSCHLTD', n: 'Bosch Ltd' },
    { s: 'COLPAL', n: 'Colgate-Palmolive (India) Ltd' }, { s: 'DABUR', n: 'Dabur India Ltd' },
    { s: 'DLF', n: 'DLF Ltd' }, { s: 'GAIL', n: 'GAIL (India) Ltd' },
    { s: 'GODREJCP', n: 'Godrej Consumer Products Ltd' }, { s: 'HAVELLS', n: 'Havells India Ltd' },
    { s: 'ICICIGI', n: 'ICICI Lombard General Insurance' }, { s: 'ICICIPRULI', n: 'ICICI Prudential Life Insurance' },
    { s: 'INDIGO', n: 'InterGlobe Aviation Ltd' }, { s: 'NAUKRI', n: 'Info Edge (India) Ltd' },
    { s: 'JINDALSTEL', n: 'Jindal Steel & Power Ltd' }, { s: 'JUBLFOOD', n: 'Jubilant FoodWorks Ltd' },
    { s: 'LTIM', n: 'LTIMindtree Ltd' }, { s: 'MARICO', n: 'Marico Ltd' },
    { s: 'MUTHOOTFIN', n: 'Muthoot Finance Ltd' }, { s: 'NMDC', n: 'NMDC Ltd' },
    { s: 'PIDILITIND', n: 'Pidilite Industries Ltd' }, { s: 'PNBHOUSING', n: 'PNB Housing Finance Ltd' },
    { s: 'RECLTD', n: 'REC Ltd' }, { s: 'SRF', n: 'SRF Ltd' },
    { s: 'SHREECEM', n: 'Shree Cement Ltd' }, { s: 'SIEMENS', n: 'Siemens Ltd' },
    { s: 'TVSMOTOR', n: 'TVS Motor Company Ltd' }, { s: 'UPL', n: 'UPL Ltd' },
    { s: 'VEDL', n: 'Vedanta Ltd' }, { s: 'VOLTAS', n: 'Voltas Ltd' },
    { s: 'AMBUJACEM', n: 'Ambuja Cements Ltd' }, { s: 'DIVISLAB', n: 'Divi\'s Laboratories Ltd' },
    { s: 'AARTIIND', n: 'Aarti Industries Ltd' }, { s: 'ABBOTINDIA', n: 'Abbott India' },
    { s: 'ABFRL', n: 'Aditya Birla Fashion' }, { s: 'ALKEM', n: 'Alkem Laboratories' },
    { s: 'AMARAJABAT', n: 'Amara Raja Batteries' }, { s: 'APOLLOTYRE', n: 'Apollo Tyres' },
    { s: 'ASHOKLEY', n: 'Ashok Leyland' }, { s: 'ASTRAL', n: 'Astral Ltd' },
    { s: 'AUBANK', n: 'AU Small Finance Bank' }, { s: 'AUROPHARMA', n: 'Aurobindo Pharma' },
    { s: 'BALKRISIND', n: 'Balkrishna Industries' }, { s: 'BALRAMCHIN', n: 'Balrampur Chini' },
    { s: 'BANDHANBNK', n: 'Bandhan Bank' }, { s: 'BANKBARODA', n: 'Bank of Baroda' },
    { s: 'BATAINDIA', n: 'Bata India' }, { s: 'BERGEPAINT', n: 'Berger Paints' },
    { s: 'BIOCON', n: 'Biocon Ltd' }, { s: 'CHAMBLFERT', n: 'Chambal Fertilisers' },
    { s: 'CHOLAFIN', n: 'Cholamandalam Inv & Fin' }, { s: 'CONCOR', n: 'Container Corp' },
    { s: 'COROMANDEL', n: 'Coromandel International' }, { s: 'CROMPTON', n: 'Crompton Greaves' },
    { s: 'CUMMINSIND', n: 'Cummins India' }, { s: 'DALBHARAT', n: 'Dalmia Bharat' },
    { s: 'DEEPAKNTR', n: 'Deepak Nitrite' }, { s: 'DELTACORP', n: 'Delta Corp' },
    { s: 'DIXON', n: 'Dixon Technologies' }, { s: 'ESCORTS', n: 'Escorts Kubota' },
    { s: 'EXIDEIND', n: 'Exide Industries' }, { s: 'FEDERALBNK', n: 'Federal Bank' },
    { s: 'GLENMARK', n: 'Glenmark Pharma' }, { s: 'GMRINFRA', n: 'GMR Infrastructure' },
    { s: 'GNFC', n: 'GNFC' }, { s: 'GODREJPROP', n: 'Godrej Properties' },
    { s: 'GRANULES', n: 'Granules India' }, { s: 'GUJGASLTD', n: 'Gujarat Gas' },
    { s: 'HAPPSTMNDS', n: 'Happiest Minds' }, { s: 'HDFCAMC', n: 'HDFC AMC' },
    { s: 'HDFCLIFE', n: 'HDFC Life' }, { s: 'IGL', n: 'Indraprastha Gas' },
    { s: 'INDIACEM', n: 'India Cements' }, { s: 'INDIAMART', n: 'IndiaMART InterMESH' },
    { s: 'IPCALAB', n: 'IPCA Labs' }, { s: 'LALPATHLAB', n: 'Dr Lal PathLabs' },
    { s: 'LICHSGFIN', n: 'LIC Housing Finance' }, { s: 'LUPIN', n: 'Lupin Ltd' },
    { s: 'MANAPPURAM', n: 'Manappuram Finance' }, { s: 'MFSL', n: 'Max Financial Services' },
    { s: 'MGL', n: 'Mahanagar Gas' }, { s: 'PAGEIND', n: 'Page Industries' },
    { s: 'PEL', n: 'Piramal Enterprises' }, { s: 'PETRONET', n: 'Petronet LNG' },
    { s: 'PFC', n: 'Power Finance Corp' }, { s: 'POLYCAB', n: 'Polycab India' },
    { s: 'RBLBANK', n: 'RBL Bank' }, { s: 'TATACHEM', n: 'Tata Chemicals' },
    { s: 'TATACOMM', n: 'Tata Communications' }, { s: 'TATAPOWER', n: 'Tata Power' },
    { s: 'TORNTPOWER', n: 'Torrent Power' }, { s: 'UNITEDSPR', n: 'United Spirits' }
  ];

  return baseSymbols.map(({s, n}) => {
    const isNifty500 = Math.random() > 0.5; // Randomly assign NIFTY500 or FNO
    const category = isNifty500 ? 'NIFTY500' : 'FNO';
    const tradeMode = category === 'FNO' ? 'INTRADAY' : 'SWING';
    const basePrice = Math.random() * 5000 + 50;
    const ltp = Number(basePrice.toFixed(2));
    const pct = Number(((Math.random() * 6) - 3).toFixed(2)); // -3% to +3%
    const change = Number(((ltp * pct) / 100).toFixed(2));
    const momentumScore = Math.floor(Math.random() * 100);
    
    const fiiRand = Math.random();
    const fiiActivity = fiiRand > 0.6 ? 'BUYING' : fiiRand > 0.3 ? 'SELLING' : 'NEUTRAL';
    const proRand = Math.random();
    const proActivity = proRand > 0.6 ? 'BUYING' : proRand > 0.3 ? 'SELLING' : 'NEUTRAL';
    
    let signal: StockData['signal'] = 'NEUTRAL';
    if (momentumScore > 80 && fiiActivity === 'BUYING' && proActivity === 'BUYING') signal = 'STRONG BUY';
    else if (momentumScore > 60 && (fiiActivity === 'BUYING' || proActivity === 'BUYING')) signal = 'BUY';
    else if (momentumScore < 20 && fiiActivity === 'SELLING' && proActivity === 'SELLING') signal = 'STRONG SELL';
    else if (momentumScore < 40 && (fiiActivity === 'SELLING' || proActivity === 'SELLING')) signal = 'SELL';

    const hours = Math.floor(Math.random() * (15 - 9 + 1)) + 9;
    const mins = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours;
    const signalTime = `${displayHours}:${mins} ${period}, Today`;

    return {
      symbol: s,
      name: n,
      category,
      tradeMode,
      ltp,
      change,
      pct,
      volumeMultiplier: Number((Math.random() * 3 + 0.5).toFixed(1)),
      momentumScore,
      fiiActivity,
      proActivity,
      signal,
      signalTime
    };
  });
};

const MOCK_STOCKS: StockData[] = generateMockStocks();

export default function StockFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'HIGH_MOMENTUM' | 'FII_BUYING' | 'INTRADAY_FOOTPRINT'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'NIFTY500' | 'FNO'>('ALL');
  const [actionFilter, setActionFilter] = useState<'ALL' | 'BUY' | 'SELL' | 'NEUTRAL'>('ALL');
  const [stocks, setStocks] = useState<StockData[]>(MOCK_STOCKS);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStocks(currentStocks => 
        currentStocks.map(stock => {
          if (Math.random() > 0.7) { // Update ~30% of stocks per tick
            const volatility = stock.ltp * 0.0015; // Max 0.15% change per tick
            const tick = (Math.random() * volatility * 2) - volatility;
            const newLtp = Number((stock.ltp + tick).toFixed(2));
            const newChange = Number((stock.change + tick).toFixed(2));
            const basePrice = newLtp - newChange;
            const newPct = Number(((newChange / basePrice) * 100).toFixed(2));
            
            let newMomentum = stock.momentumScore;
            if (Math.random() > 0.8) {
               newMomentum = Math.max(0, Math.min(100, newMomentum + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 4)));
            }

            return {
              ...stock,
              ltp: newLtp,
              change: newChange,
              pct: newPct,
              momentumScore: newMomentum
            };
          }
          return stock;
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    
    if (categoryFilter !== 'ALL' && stock.category !== categoryFilter) return false;

    if (actionFilter !== 'ALL') {
      if (actionFilter === 'BUY' && stock.signal !== 'BUY' && stock.signal !== 'STRONG BUY') return false;
      if (actionFilter === 'SELL' && stock.signal !== 'SELL' && stock.signal !== 'STRONG SELL') return false;
      if (actionFilter === 'NEUTRAL' && stock.signal !== 'NEUTRAL') return false;
    }

    if (filter === 'HIGH_MOMENTUM') return stock.momentumScore > 80;
    if (filter === 'FII_BUYING') return stock.fiiActivity === 'BUYING' && stock.proActivity === 'BUYING';
    if (filter === 'INTRADAY_FOOTPRINT') return stock.tradeMode === 'INTRADAY' && stock.momentumScore > 80 && stock.fiiActivity === 'BUYING' && stock.proActivity === 'BUYING';
    
    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Stock Finder Core</h2>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live Hub</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs font-medium mt-1">FNO (Intraday) & NIFTY 500 (Swing) Momentum scanning</p>
        </div>
      </div>

      <Card className="bg-[#101114] border-slate-800 overflow-hidden">
        <CardHeader className="bg-[#15171a] border-b border-slate-800 p-4 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-64 flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search FNO/NIFTY 500 stocks..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0d0f12] border border-slate-700 text-sm text-slate-200 pl-9 pr-4 py-2 rounded focus:outline-none focus:border-blue-500 transition-colors uppercase"
              />
            </div>
            
            <div className="flex-1 flex flex-wrap gap-2 md:justify-end items-center">
              <div className="flex bg-[#0d0f12] border border-slate-700 rounded p-1">
                {['ALL', 'NIFTY500', 'FNO'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat as any)}
                    className={cn(
                      "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors whitespace-nowrap",
                      categoryFilter === cat ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    )}
                  >
                    {cat === 'NIFTY500' ? 'NIFTY 500 (SWING)' : cat === 'FNO' ? 'FNO (INTRADAY)' : 'ALL'}
                  </button>
                ))}
              </div>

              <div className="flex bg-[#0d0f12] border border-slate-700 rounded p-1">
                {['ALL', 'BUY', 'SELL', 'NEUTRAL'].map((act) => (
                  <button
                    key={act}
                    onClick={() => setActionFilter(act as any)}
                    className={cn(
                      "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors whitespace-nowrap",
                      actionFilter === act ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    )}
                  >
                    {act === 'ALL' ? 'ALL ACTION' : act}
                  </button>
                ))}
              </div>
            </div>
          </div>
            
          <div className="flex bg-[#0d0f12] border border-slate-700 rounded p-1 w-full overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Condition' },
              { id: 'HIGH_MOMENTUM', label: 'High Momentum' },
              { id: 'FII_BUYING', label: 'FII + PRO Buying' },
              { id: 'INTRADAY_FOOTPRINT', label: 'Intraday Footprint Strategy' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={cn(
                  "flex-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors",
                  filter === f.id ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase bg-[#15171a] text-slate-400 font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3 text-right">LTP (₹)</th>
                  <th className="px-4 py-3 text-right">Momentum</th>
                  <th className="px-4 py-3 text-center">FII Flow</th>
                  <th className="px-4 py-3 text-center">PRO Flow</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredStocks.map((stock) => {
                  const isPositive = stock.change >= 0;
                  return (
                    <tr key={stock.symbol} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-200">{stock.symbol}</span>
                              <span className={cn(
                                "text-[8px] font-bold px-1 py-0.5 rounded uppercase tracking-wider",
                                stock.category === 'NIFTY500' ? "bg-amber-900/40 text-amber-400 border border-amber-900/50" : "bg-blue-900/40 text-blue-400 border border-blue-900/50"
                              )}>
                                {stock.category === 'NIFTY500' ? 'NIFTY 500' : 'FNO'} • {stock.tradeMode}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{stock.name}</div>
                          </div>
                          {stock.momentumScore > 80 && (
                            <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="font-mono text-slate-200 font-bold">{stock.ltp.toFixed(2)}</div>
                        <div className={cn("text-[10px] font-mono", isPositive ? "text-emerald-400" : "text-red-400")}>
                          {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.pct}%)
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full", stock.momentumScore > 75 ? "bg-emerald-500" : stock.momentumScore > 40 ? "bg-yellow-500" : "bg-red-500")}
                              style={{ width: `${stock.momentumScore}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-300 w-6 text-right">{stock.momentumScore}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider",
                          stock.fiiActivity === 'BUYING' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : 
                          stock.fiiActivity === 'SELLING' ? "bg-red-500/10 text-red-400 border border-red-500/20" : 
                          "bg-slate-800 text-slate-400 border border-slate-700"
                        )}>
                          {stock.fiiActivity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider",
                          stock.proActivity === 'BUYING' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : 
                          stock.proActivity === 'SELLING' ? "bg-red-500/10 text-red-400 border border-red-500/20" : 
                          "bg-slate-800 text-slate-400 border border-slate-700"
                        )}>
                          {stock.proActivity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded shadow uppercase tracking-wider w-20 text-center",
                            (stock.signal === 'STRONG BUY' || stock.signal === 'BUY') ? "bg-emerald-600 text-white" : 
                            (stock.signal === 'STRONG SELL' || stock.signal === 'SELL') ? "bg-red-600 text-white" : 
                            "bg-slate-700 text-slate-300"
                          )}>
                            {stock.signal}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium tracking-tight whitespace-nowrap">
                            {stock.signalTime}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filteredStocks.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">
                      No stocks match the given criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
