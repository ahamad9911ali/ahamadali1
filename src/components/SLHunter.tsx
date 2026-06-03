import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Target, Zap, TrendingUp, TrendingDown, Clock, Crosshair, Volume2, VolumeX } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Core';
import { cn } from '../lib/utils';
import { Toaster, toast } from 'sonner';

const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1); // A6
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.3);
  } catch (error) {
    console.error('Audio playback failed', error);
  }
};

interface SLSignal {
  id: string;
  timestamp: string;
  asset: 'NIFTY' | 'SENSEX';
  direction: 'BUY_CALL' | 'BUY_PUT';
  strike: string;
  entryPrice: number;
  slHunterLogic: string;
  targetPrice: number;
  stopLoss: number;
  status: 'ACTIVE' | 'HIT_TARGET' | 'HIT_SL';
  exitTime?: string;
  confidence: number;
  score: number;
}

const generateMockSLSignals = (): SLSignal[] => {
  const assets: ('NIFTY' | 'SENSEX')[] = ['NIFTY', 'SENSEX'];
  const dirs: ('BUY_CALL' | 'BUY_PUT')[] = ['BUY_CALL', 'BUY_PUT'];
  const targetLogic = [
    "Retail trapped near day high, mapping liquidity sweep below PDL.",
    "Bulls lured in breakout, big players filling orders at trap zone.",
    "Stop losses clustered above 50 EMA, expecting upward spike to trigger them.",
    "Morning range breakout proved false, reversing to hunt initial stops."
  ];

  const now = new Date();
  
  return Array.from({ length: 12 }).map((_, i) => {
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    const baseStrike = asset === 'NIFTY' ? 22000 : 74000;
    const strike = `${baseStrike + (Math.floor(Math.random() * 5) - 2) * (asset === 'NIFTY' ? 50 : 100)}`;
    const entry = Math.floor(Math.random() * 150) + 50;
    const target = entry + Math.floor(Math.random() * 80) + 20;
    const sl = entry - (Math.floor(Math.random() * 20) + 10);
    const logic = targetLogic[Math.floor(Math.random() * targetLogic.length)];

    const pastTime = new Date(now.getTime() - (Math.floor(Math.random() * 120) * 60000));
    
    // Status probability
    const randStat = Math.random();
    let status: 'ACTIVE' | 'HIT_TARGET' | 'HIT_SL' = 'ACTIVE';
    let exitTime: string | undefined;

    if (randStat > 0.6) {
      status = 'HIT_TARGET';
      exitTime = new Date(pastTime.getTime() + Math.random() * 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (randStat > 0.4) {
      status = 'HIT_SL';
      exitTime = new Date(pastTime.getTime() + Math.random() * 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return {
      id: `sl-${i}`,
      timestamp: pastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      asset,
      direction: dir,
      strike,
      entryPrice: entry,
      slHunterLogic: logic,
      targetPrice: target,
      stopLoss: sl,
      status,
      exitTime,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100
      score: Math.floor(Math.random() * 40) + 60 // 60-100
    };
  }).sort((a, b) => b.id.localeCompare(a.id)); 
};

export default function SLHunter() {
  const [signals, setSignals] = useState<SLSignal[]>([]);
  const [filterAsset, setFilterAsset] = useState<'ALL' | 'NIFTY' | 'SENSEX'>('ALL');
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const soundEnabledRef = useRef(isSoundEnabled);

  const [marketContext, setMarketContext] = useState({
    NIFTY: { trend: 'BULLISH' as const, resistance: '22,550', support: '22,380' },
    SENSEX: { trend: 'BEARISH' as const, resistance: '74,100', support: '73,800' }
  });

  useEffect(() => {
    soundEnabledRef.current = isSoundEnabled;
  }, [isSoundEnabled]);

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
    // Generate initial payload 
    setSignals(generateMockSLSignals());

    const interval = setInterval(() => {
      setSignals(prev => {
        const hasActive = prev.some(s => s.status === 'ACTIVE');
        // Random chance to resolve an active signal
        if (hasActive && Math.random() > 0.6) {
          const actives = prev.filter(p => p.status === 'ACTIVE');
          const toResolve = actives[Math.floor(Math.random() * actives.length)];
          const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          toResolve.status = Math.random() > 0.7 ? 'HIT_SL' : 'HIT_TARGET';
          toResolve.exitTime = nowTime;
          toast(`${toResolve.asset} ${toResolve.direction.replace('_', ' ')} ${toResolve.status === 'HIT_TARGET' ? 'hit TARGET' : 'hit SL'}`, {
            icon: toResolve.status === 'HIT_TARGET' ? '🎯' : '💔'
          });
          
          if (soundEnabledRef.current) {
             playNotificationSound();
          }

          return [...prev];
        }

        // Random chance to generate a new signal
        if (Math.random() > 0.7) {
          const liveLogic = [
            "Morning range breakout proved false, reversing to hunt initial stops.",
            "Bulls lured in breakout, big players filling orders at trap zone."
          ];
          const newSig: SLSignal = {
            id: `sl-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            asset: Math.random() > 0.5 ? 'NIFTY' : 'SENSEX',
            direction: Math.random() > 0.5 ? 'BUY_CALL' : 'BUY_PUT',
            strike: `${Math.random() > 0.5 ? 22500 : 74000}`,
            entryPrice: Math.floor(Math.random() * 150) + 50,
            slHunterLogic: liveLogic[Math.floor(Math.random() * liveLogic.length)],
            targetPrice: 0,
            stopLoss: 0,
            status: 'ACTIVE',
            confidence: Math.floor(Math.random() * 20) + 80,
            score: Math.floor(Math.random() * 20) + 80
          };
          newSig.targetPrice = newSig.entryPrice + 60;
          newSig.stopLoss = newSig.entryPrice - 20;

          toast(`New SL Hunter signal: ${newSig.asset} ${newSig.direction.replace('_', ' ')}`, {
            icon: '🔫' 
          });
          
          if (soundEnabledRef.current) {
             playNotificationSound();
          }

          return [newSig, ...prev].slice(0, 50);
        }

        return prev;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const visibleSignals = useMemo(() => {
    if (filterAsset === 'ALL') return signals;
    return signals.filter(s => s.asset === filterAsset);
  }, [signals, filterAsset]);

  const stats = useMemo(() => {
    const closed = visibleSignals.filter(s => s.status !== 'ACTIVE');
    if (closed.length === 0) return { winRate: 0, totalClosed: 0 };
    const wins = closed.filter(s => s.status === 'HIT_TARGET').length;
    return {
      winRate: Math.round((wins / closed.length) * 100),
      totalClosed: closed.length
    }
  }, [visibleSignals])

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="bg-[#101114] border border-red-500/20 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-40 bg-red-500/5 rounded-full blur-[60px] pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-white tracking-tight uppercase">SL Hunting Zone</h2>
          </div>
          <p className="text-xs text-slate-400 font-medium">Tracking retail stop losses and institutional liquidity grabs.</p>
        </div>
        <div className="flex bg-[#1a1c21] border border-slate-800 rounded-lg p-1 relative z-10 whitespace-nowrap overflow-x-auto max-w-full items-center gap-1">
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={cn(
              "p-1.5 rounded-md text-[10px] font-bold transition-all border",
              isSoundEnabled
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800 border-transparent"
            )}
            title="Toggle sound alerts"
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <div className="w-[1px] h-6 bg-slate-800 mx-1"></div>
          {(['ALL', 'NIFTY', 'SENSEX'] as const).map(asset => (
            <button
              key={asset}
              onClick={() => setFilterAsset(asset)}
              className={cn(
                "px-4 py-1.5 rounded-md text-[10px] font-bold transition-all uppercase tracking-wider text-slate-400 hover:text-white",
                filterAsset === asset && "bg-red-500/10 text-red-400 border shadow-sm" 
              )}
            >
              {asset === 'ALL' ? 'ALL INDICES' : asset}
            </button>
          ))}
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
        <div className="bg-[#101114] border border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Success Rate</div>
          <div className="text-2xl font-black text-white">{stats.totalClosed > 0 ? `${stats.winRate}%` : '-'}</div>
        </div>
        <div className="bg-[#101114] border border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Closed Trades</div>
          <div className="text-2xl font-black text-white">{stats.totalClosed}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleSignals.map(signal => (
          <Card key={signal.id} className={cn(
            "bg-[#101114] transition-all relative overflow-hidden",
            signal.status === 'ACTIVE' ? "border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]" :
            signal.status === 'HIT_TARGET' ? "border-emerald-500/30 opacity-70" : "border-rose-500/30 opacity-70"
          )}>
            <div className="absolute top-0 right-0 p-2">
              <span className={cn(
                "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1",
                signal.status === 'ACTIVE' ? "bg-red-500/20 text-red-400" :
                signal.status === 'HIT_TARGET' ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
              )}>
                {signal.status === 'ACTIVE' && <Crosshair className="w-2.5 h-2.5" />}
                {signal.status.replace('_', ' ')}
              </span>
            </div>
            <CardHeader className="pb-2 border-b border-slate-800 bg-[#15171a]/50 p-3">
              <CardTitle className="flex justify-between items-start">
                <div>
                  <div className="text-[12px] font-black text-white tracking-widest uppercase flex items-center gap-1.5 mb-0.5">
                    {signal.asset} <span className="text-slate-500">{signal.strike}</span> 
                  </div>
                  <div className={cn(
                    "text-[11px] font-bold tracking-widest uppercase",
                    signal.direction === 'BUY_CALL' ? "text-emerald-400" : "text-rose-400"
                  )}>
                    {signal.direction.replace('_', ' ')}
                  </div>
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
                  "{signal.slHunterLogic}"
                </div>
                
                <div className="flex flex-col items-center shrink-0 pr-2 border-r border-slate-700 mr-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Score</span>
                  <span className="text-sm font-black text-white">{signal.score || (signal.confidence > 80 ? 85 : 75)}</span>
                </div>
                
                <div className="flex flex-col items-center shrink-0 pr-1">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="transparent" className="stroke-slate-800" strokeWidth="3" />
                      <circle cx="18" cy="18" r="14" fill="transparent" className={signal.confidence >= 85 ? "stroke-emerald-500" : "stroke-amber-500"} strokeWidth="3" strokeDasharray={2 * Math.PI * 14} strokeDashoffset={2 * Math.PI * 14 - (signal.confidence / 100) * (2 * Math.PI * 14)} strokeLinecap="round" />
                    </svg>
                    <div className="absolute flex items-center justify-center">
                      <span className="text-[10px] font-black text-white">{signal.confidence}%</span>
                    </div>
                  </div>
                  <span className="text-[7.5px] uppercase font-bold text-slate-500 mt-0.5 tracking-wider">Prob</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="bg-[#1a1c21] rounded p-2 text-center border-l-2 border-slate-700">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Entry</div>
                  <div className="font-mono text-sm text-white font-bold">{signal.entryPrice}</div>
                </div>
                <div className="bg-[#1a1c21] rounded p-2 text-center border-l-2 border-emerald-500/50">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                    <Target className="w-2.5 h-2.5 text-emerald-400" /> Target
                  </div>
                  <div className="font-mono text-sm text-emerald-400 font-bold">{signal.targetPrice}</div>
                </div>
                <div className="bg-[#1a1c21] rounded p-2 text-center border-l-2 border-rose-500/50">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">SL</div>
                  <div className="font-mono text-sm text-rose-400 font-bold">{signal.stopLoss}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {visibleSignals.length === 0 && (
          <div className="col-span-full h-32 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-lg">
            <Crosshair className="w-6 h-6 mb-2 opacity-50" />
            <p className="text-xs uppercase tracking-widest font-bold">No active hunts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
