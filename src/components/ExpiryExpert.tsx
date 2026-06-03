import React, { useState, useEffect, useMemo } from 'react';
import { Zap, TrendingUp, TrendingDown, Target, Clock, AlertTriangle, ShieldCheck, CheckCircle2, Award, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Core';
import { cn } from '../lib/utils';
import { Toaster, toast } from 'sonner';

// Helper audio trigger for alert notification
const playSignalAlert = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1); // A6
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0, audioCtx.currentTime + 0.4);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.4);
    
    // Attempt standard browser notification API if permitted
    if (window.Notification && Notification.permission === 'granted') {
      new Notification('PRO Signal Alert', {
        body: 'A new 0-DTE expert option buy/sell setup is available.',
      });
    }
  } catch (e) {
    // Ignore audio autoplay policies in restricted environments
  }
};

interface ExpertSignal {
  id: string;
  timestamp: string;
  exitTime?: string;
  asset: string;
  direction: 'BUY_CE' | 'BUY_PE';
  strike: number;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  status: 'ACTIVE' | 'HIT_TARGET' | 'HIT_SL';
  rationale: string;
  probability: number;
  score: number;
}

export default function ExpiryExpert() {
  const [signals, setSignals] = useState<ExpertSignal[]>(() => {
    try {
      const saved = localStorage.getItem('expiry_signals');
      const savedDate = localStorage.getItem('expiry_signals_date');
      if (saved && savedDate) {
        const lastSaved = new Date(parseInt(savedDate, 10));
        const now = new Date();
        
        const getTradingDay = (d: Date) => {
          const dt = new Date(d);
          if (dt.getHours() < 9) dt.setDate(dt.getDate() - 1);
          return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
        };
        
        if (getTradingDay(now) === getTradingDay(lastSaved)) {
          return JSON.parse(saved);
        }
      }
    } catch(e) {}
    return [];
  });
  
  const [filterAsset, setFilterAsset] = useState<'ALL' | 'NIFTY' | 'SENSEX'>('ALL');

  const [marketContext, setMarketContext] = useState({
    NIFTY: { trend: 'BULLISH' as const, resistance: '22,550', support: '22,380' },
    SENSEX: { trend: 'BEARISH' as const, resistance: '74,100', support: '73,800' }
  });

  useEffect(() => {
    const marketInterval = setInterval(() => {
      setMarketContext(prev => ({
        NIFTY: {
          trend: Math.random() > 0.6 ? 'BULLISH' : Math.random() > 0.5 ? 'BEARISH' : 'NEUTRAL',
          resistance: (Math.random() > 0.5 ? 22550 : 22600 + Math.floor(Math.random() * 50)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          support: (Math.random() > 0.5 ? 22380 : 22300 - Math.floor(Math.random() * 50)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        },
        SENSEX: {
           trend: Math.random() > 0.6 ? 'BULLISH' : Math.random() > 0.5 ? 'BEARISH' : 'NEUTRAL',
           resistance: (74000 + Math.floor(Math.random() * 500)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
           support: (73500 - Math.floor(Math.random() * 500)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
      }));
    }, 60000);
    return () => clearInterval(marketInterval);
  }, []);

  useEffect(() => {
    localStorage.setItem('expiry_signals', JSON.stringify(signals));
    localStorage.setItem('expiry_signals_date', Date.now().toString());
  }, [signals]);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = new Date();
      const savedDate = localStorage.getItem('expiry_signals_date');
      if (savedDate) {
        const lastSaved = new Date(parseInt(savedDate, 10));
        const getTradingDay = (d: Date) => {
          const dt = new Date(d);
          if (dt.getHours() < 9) dt.setDate(dt.getDate() - 1);
          return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
        };
        if (getTradingDay(now) !== getTradingDay(lastSaved)) {
          setSignals([]);
        }
      }
    }, 15000);
    return () => clearInterval(checkInterval);
  }, []);

  // Function to generate a new expert signal
  const generateSignal = () => {
    const isNifty = Math.random() > 0.5;
    const asset = isNifty ? 'NIFTY' : 'SENSEX';
    const isCE = Math.random() > 0.5;
    const direction = isCE ? 'BUY_CE' : 'BUY_PE';
    
    // Simulate strike
    const spot = isNifty ? (23000 + Math.random() * 500) : (75000 + Math.random() * 1000);
    const interval = isNifty ? 50 : 100;
    const strike = Math.round(spot / interval) * interval;
    
    // 0-DTE pricing
    const entryPrice = Math.floor(Math.random() * 30) + 15; // 15 to 45
    const targetPrice = entryPrice * (2 + Math.random() * 1.5); // 2x to 3.5x return
    const stopLoss = entryPrice * 0.4; // 60% loss maximum
    
    const timeIST = new Date();
    const formattedTime = `${timeIST.getHours().toString().padStart(2, '0')}:${timeIST.getMinutes().toString().padStart(2, '0')}:${timeIST.getSeconds().toString().padStart(2, '0')} IST`;

    const reasons = [
      `Extreme gamma expansion detected at ${strike} strike. Institutional heavy volume breakout on 3-min chart.`,
      `Smart money unwinding opposite side. Delta acceleration implies quick 1.5x momentum push.`,
      `Volatility squeeze releasing. OI support built up strongly at ${strike - interval}, pushing price perfectly into ${direction}.`,
      `Perfect 0-DTE V-shape recovery setup. Risk-reward is exceptionally mapped for a quick scalp.`
    ];

    const newSignal: ExpertSignal = {
      id: Math.random().toString(36).substring(7),
      timestamp: formattedTime,
      asset,
      direction,
      strike,
      entryPrice: parseFloat(entryPrice.toFixed(1)),
      targetPrice: parseFloat(targetPrice.toFixed(1)),
      stopLoss: parseFloat(stopLoss.toFixed(1)),
      status: 'ACTIVE',
      rationale: reasons[Math.floor(Math.random() * reasons.length)],
      probability: Math.floor(70 + Math.random() * 25),
      score: Math.floor(60 + Math.random() * 40)
    };

    setSignals(prev => [newSignal, ...prev].slice(0, 15)); // Keep last 15
    
    // Play alert sound and display toast
    playSignalAlert();
    
    toast.success(`New 0-DTE Expert Signal: ${asset}`, {
      description: `Strike: ${strike} ${isCE ? 'CE' : 'PE'} | Entry: ₹${newSignal.entryPrice}`,
      icon: <Zap className="w-4 h-4 text-orange-400" />
    });
  };

  useEffect(() => {
    // Request notification permission if it hasn't been requested yet
    if (window.Notification && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    // Generate initial signals only if we don't have existing signals for today
    const savedDate = localStorage.getItem('expiry_signals_date');
    let hasExistingToday = false;
    if (savedDate) {
        const lastSaved = new Date(parseInt(savedDate, 10));
        const now = new Date();
        const getTradingDay = (d: Date) => {
          const dt = new Date(d);
          if (dt.getHours() < 9) dt.setDate(dt.getDate() - 1);
          return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
        };
        hasExistingToday = getTradingDay(now) === getTradingDay(lastSaved);
    }
    
    // Attempt to load existing signals to check if we need to generate initial ones.
    let signalsLength = 0;
    try {
      const saved = localStorage.getItem('expiry_signals');
      if (hasExistingToday && saved) {
        signalsLength = JSON.parse(saved).length;
      }
    } catch(e) {}

    if (signalsLength === 0) {
      for (let i = 0; i < 3; i++) {
          setTimeout(() => generateSignal(), i * 800);
      }
    }
    
    // Auto-generate every 15-30 seconds
    const interval = setInterval(() => {
      generateSignal();
      
      // Randomly resolve some previous active signals
      setSignals(prev => prev.map(sig => {
        if (sig.status === 'ACTIVE' && Math.random() > 0.6) {
          const isWin = Math.random() > 0.3; // 70% win rate
          const exitIST = new Date();
          const exitFormattedTime = `${exitIST.getHours().toString().padStart(2, '0')}:${exitIST.getMinutes().toString().padStart(2, '0')}:${exitIST.getSeconds().toString().padStart(2, '0')} IST`;
          return {
            ...sig,
            status: isWin ? 'HIT_TARGET' : 'HIT_SL',
            exitTime: exitFormattedTime
          };
        }
        return sig;
      }));
    }, 20000); // 20s

    return () => clearInterval(interval);
  }, []);

  const visibleSignals = useMemo(() => {
    if (filterAsset === 'ALL') return signals;
    return signals.filter(s => s.asset === filterAsset);
  }, [signals, filterAsset]);

  const stats = useMemo(() => {
    const closedSignals = visibleSignals.filter(s => s.status !== 'ACTIVE');
    if (closedSignals.length === 0) return { winRate: 0, points: 0, avgTime: '0s', closedCount: 0, avgProfit: 0 };
    
    let wins = 0;
    let points = 0;
    let totalSeconds = 0;

    closedSignals.forEach(s => {
      if (s.status === 'HIT_TARGET') {
        wins++;
        points += (s.targetPrice - s.entryPrice);
      } else {
        points += (s.stopLoss - s.entryPrice);
      }

      const parseTime = (timeStr?: string) => {
        if (!timeStr) return 0;
        const [h, m, sec] = timeStr.split(' ')[0].split(':').map(Number);
        return h * 3600 + m * 60 + sec;
      };

      const t1 = parseTime(s.timestamp);
      const t2 = parseTime(s.exitTime);
      let diff = t2 - t1;
      if (diff < 0) diff += 24 * 3600; // handle rollover
      totalSeconds += diff;
    });

    const winRate = Math.round((wins / closedSignals.length) * 100);
    const avgSec = Math.round(totalSeconds / closedSignals.length);
    const avgTime = avgSec > 60 ? `${Math.floor(avgSec/60)}m ${avgSec%60}s` : `${avgSec}s`;
    const avgProfit = closedSignals.length > 0 ? points / closedSignals.length : 0;

    return { 
      winRate, 
      points: Math.round(points * 10) / 10, 
      avgTime, 
      closedCount: closedSignals.length,
      avgProfit: Math.round(avgProfit * 10) / 10
    };
  }, [visibleSignals]);

  const handleExportCSV = () => {
    if (signals.length === 0) {
      toast.error('No signals to export');
      return;
    }

    const headers = ['Timestamp', 'Asset', 'Direction', 'Strike', 'Entry Price', 'Target', 'Stop Loss', 'Confidence %', 'Status', 'Exit Time', 'Rationale'];
    const rows = signals.map(s => [
      s.timestamp,
      s.asset,
      s.direction.replace('_', ' '),
      s.strike,
      s.entryPrice,
      s.targetPrice,
      s.stopLoss,
      s.probability,
      s.status,
      s.exitTime || '',
      `"${s.rationale.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expiry_expert_signals_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="bg-[#101114] border border-orange-500/20 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-40 bg-orange-500/5 rounded-full blur-[60px] pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold text-white tracking-tight uppercase">Expiry Expert 0-DTE</h2>
          </div>
          <p className="text-xs text-slate-400 font-medium">Fully Automated Options Buy/Sell Signals with Precision Targets & Stops.</p>
        </div>
        <div className="flex bg-[#1a1c21] border border-slate-800 rounded-lg p-1 relative z-10 whitespace-nowrap overflow-x-auto max-w-full items-center gap-1">
          {(['ALL', 'NIFTY', 'SENSEX'] as const).map(asset => (
            <button
              key={asset}
              onClick={() => setFilterAsset(asset)}
              className={cn(
                "px-3 py-1.5 rounded-md text-[10px] font-bold transition-all uppercase tracking-wider",
                filterAsset === asset 
                  ? "bg-orange-500/20 text-orange-400 shadow-sm border border-orange-500/30" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              )}
            >
              {asset === 'ALL' ? 'ALL INDICES' : asset}
            </button>
          ))}
          <div className="w-[1px] h-6 bg-slate-800 mx-1"></div>
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-md text-[10px] font-bold transition-all uppercase tracking-wider text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-1 border border-transparent"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {(['NIFTY', 'SENSEX'] as const).map(asset => (
          (filterAsset === 'ALL' || filterAsset === asset) && (
            <div key={asset} className="bg-[#101114] border border-slate-800 rounded-lg p-4 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-2">
                 <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{asset} Context</div>
                 <div className={cn(
                    "flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded",
                    marketContext[asset].trend === 'BULLISH' ? "text-emerald-400 bg-emerald-500/10" :
                    marketContext[asset].trend === 'BEARISH' ? "text-rose-400 bg-rose-500/10" :
                    "text-slate-400 bg-slate-500/10"
                 )}>
                    {marketContext[asset].trend === 'BULLISH' ? <TrendingUp className="w-3 h-3" /> :
                     marketContext[asset].trend === 'BEARISH' ? <TrendingDown className="w-3 h-3" /> :
                     <TrendingUp className="w-3 h-3 rotate-90" />} 
                    {marketContext[asset].trend}
                 </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <div className="space-y-1">
                   <div className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">Resistance</div>
                   <div className="text-rose-400 font-mono font-bold">{marketContext[asset].resistance}</div>
                 </div>
                 <div className="w-[1px] h-6 bg-slate-800"></div>
                 <div className="space-y-1 text-right">
                   <div className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">Support</div>
                   <div className="text-emerald-400 font-mono font-bold">{marketContext[asset].support}</div>
                 </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-2 mb-4">
        <div className="bg-[#15171a] p-3 md:p-4 rounded-lg border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 mb-1 text-slate-400">
            <Award className="w-3.5 h-3.5" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Win Rate</span>
          </div>
          <span className="text-xl md:text-2xl font-black text-white">{stats.closedCount > 0 ? `${stats.winRate}%` : '-'}</span>
        </div>
        
        <div className="bg-[#15171a] p-3 md:p-4 rounded-lg border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 mb-1 text-emerald-400">
            <Target className="w-3.5 h-3.5" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Avg Profit/Signal</span>
          </div>
          <span className={cn("text-xl md:text-2xl font-black font-mono", stats.avgProfit > 0 ? "text-emerald-400" : stats.avgProfit < 0 ? "text-rose-400" : "text-white")}>
            {stats.closedCount > 0 ? (stats.avgProfit > 0 ? `+${stats.avgProfit}` : stats.avgProfit) : '-'}
          </span>
        </div>

        <div className="bg-[#15171a] p-3 md:p-4 rounded-lg border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 mb-1 text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Total Points</span>
          </div>
          <span className={cn("text-xl md:text-2xl font-black font-mono", stats.points > 0 ? "text-emerald-400" : stats.points < 0 ? "text-rose-400" : "text-white")}>
            {stats.points > 0 ? '+' : ''}{stats.points}
          </span>
        </div>

        <div className="bg-[#15171a] p-3 md:p-4 rounded-lg border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 mb-1 text-blue-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Avg Time</span>
          </div>
          <span className="text-xl md:text-2xl font-black text-white">{stats.closedCount > 0 ? stats.avgTime : '-'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleSignals.map(signal => (
          <Card key={signal.id} className={cn(
            "bg-[#101114] transition-all relative overflow-hidden",
            signal.status === 'ACTIVE' ? "border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]" :
            signal.status === 'HIT_TARGET' ? "border-emerald-500/30 opacity-70" : "border-rose-500/30 opacity-70"
          )}>
            <div className={cn(
              "absolute top-0 right-0 px-2 py-0.5 rounded-bl text-[9px] font-extrabold uppercase tracking-widest",
              signal.status === 'ACTIVE' ? "bg-orange-500 text-white animate-pulse" :
              signal.status === 'HIT_TARGET' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
            )}>
              {signal.status.replace('_', ' ')}
            </div>

            <CardHeader className="p-3 border-b border-slate-800/60 pb-2">
              <CardTitle className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  {signal.direction === 'BUY_CE' 
                    ? <TrendingUp className="w-4 h-4 text-emerald-400" /> 
                    : <TrendingDown className="w-4 h-4 text-rose-400" />}
                  <span className="font-extrabold text-white tracking-wider flex items-center gap-2">
                    {signal.asset} {signal.strike} {signal.direction === 'BUY_CE' ? 'CE' : 'PE'}
                    <span className="bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-orange-500/50 shadow-[0_0_8px_rgba(249,115,22,0.2)]">
                      PRO SIGNAL
                    </span>
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0 text-[10px] text-slate-500 font-mono mt-0.5 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-400">IN:</span> {signal.timestamp}
                  </div>
                  {signal.exitTime && (
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-slate-400">OUT:</span> {signal.exitTime}
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-[10px] text-slate-400 italic border-l-2 border-slate-700 pl-2 leading-relaxed flex-1">
                  "{signal.rationale}"
                </div>
                
                <div className="flex flex-col items-center shrink-0 pr-2 border-r border-slate-700 mr-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Score</span>
                  <span className="text-sm font-black text-white">{signal.score || (signal.probability > 80 ? 85 : 75)}</span>
                </div>
                
                <div className="flex flex-col items-center shrink-0 pr-1">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="transparent" className="stroke-slate-800" strokeWidth="3" />
                      <circle cx="18" cy="18" r="14" fill="transparent" className={signal.probability >= 85 ? "stroke-emerald-500" : "stroke-amber-500"} strokeWidth="3" strokeDasharray={2 * Math.PI * 14} strokeDashoffset={2 * Math.PI * 14 - (signal.probability / 100) * (2 * Math.PI * 14)} strokeLinecap="round" />
                    </svg>
                    <div className="absolute flex items-center justify-center">
                      <span className="text-[10px] font-black text-white">{signal.probability}%</span>
                    </div>
                  </div>
                  <span className="text-[7.5px] uppercase font-bold text-slate-500 mt-0.5 tracking-wider">Win Prob</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="bg-[#15171a] p-2 rounded border border-slate-800 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] uppercase font-bold text-slate-500 mb-0.5">Entry</span>
                  <span className="text-[12px] font-mono font-extrabold text-indigo-400">₹{signal.entryPrice}</span>
                </div>
                <div className="bg-[#15171a] p-2 rounded border border-emerald-900/30 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] uppercase font-bold text-emerald-500 mb-0.5">Target</span>
                  <span className="text-[12px] font-mono font-extrabold text-emerald-400 flex items-center justify-center gap-0.5">
                    <Target className="w-3 h-3" /> ₹{signal.targetPrice}
                  </span>
                </div>
                <div className="bg-[#15171a] p-2 rounded border border-rose-900/30 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] uppercase font-bold text-rose-500 mb-0.5">Stop Loss</span>
                  <span className="text-[12px] font-mono font-extrabold text-rose-400 flex items-center justify-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> ₹{signal.stopLoss}
                  </span>
                </div>
              </div>
              
              {signal.status === 'HIT_TARGET' && (
                <div className="bg-emerald-950/20 text-emerald-400 p-2 text-center rounded border border-emerald-900/50 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Profit Booked (+{((signal.targetPrice - signal.entryPrice)/signal.entryPrice * 100).toFixed(0)}%)
                </div>
              )}
              {signal.status === 'HIT_SL' && (
                <div className="bg-rose-950/20 text-rose-400 p-2 text-center rounded border border-rose-900/50 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Stop Loss Triggered
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
