import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/Core';
import { Droplets, Target, ShieldAlert, Zap, Clock, Activity, Crosshair } from 'lucide-react';
import { cn } from '../lib/utils';

type StrategyTab = 'ALL' | 'LIQUIDITY' | 'STOP_HUNTS' | 'OI_TRAPS' | 'MOMENTUM' | 'SCALPING';

interface IndexConfig {
  name: string;
  ltp: number;
  chg: number;
}

const INDEX_CONFIGS: IndexConfig[] = [
  { name: 'NIFTY 50', ltp: 22850.45, chg: -0.25 },
  { name: 'BANK NIFTY', ltp: 48950.20, chg: 0.15 },
  { name: 'FINNIFTY', ltp: 21650.80, chg: -0.80 },
  { name: 'SENSEX', ltp: 75420.10, chg: -0.15 }
];

const tabsConfig: Record<StrategyTab, { icon: any; label: string; color: string; bg: string; desc: string }> = {
  ALL: { icon: Crosshair, label: 'All Signals', color: 'text-indigo-400', bg: 'bg-indigo-500', desc: 'Combined view of all Smart Money Core Pillars (Liquidity, Stop Hunts, OI Traps, Momentum, Scalping)' },
  LIQUIDITY: { icon: Droplets, label: 'Liquidity', color: 'text-blue-400', bg: 'bg-blue-500', desc: 'Identify sweeps, order blocks, and dark pool nodes' },
  STOP_HUNTS: { icon: Target, label: 'Stop Hunts', color: 'text-red-400', bg: 'bg-red-500', desc: 'Engineered trigger zones to trap retail momentum' },
  OI_TRAPS: { icon: ShieldAlert, label: 'OI Traps', color: 'text-amber-400', bg: 'bg-amber-500', desc: 'Find panic unwinding and trapped retail writers' },
  MOMENTUM: { icon: Zap, label: 'Momentum', color: 'text-purple-400', bg: 'bg-purple-500', desc: 'Delta & Gamma expansion tracking for aggressive entries' },
  SCALPING: { icon: Activity, label: 'Scalp Trap', color: 'text-emerald-400', bg: 'bg-emerald-500', desc: 'Intraday Scalping Liquidity Trap Entry Smart Money Reversals' }
};

interface PillarData {
  items: { title: string; val: string; active: boolean }[];
  signals: {
    id: string;
    time: string;
    exitTime?: string;
    type: string;
    action: string;
    asset: string;
    strike: number;
    price: number;
    targetPrice?: number;
    stopLoss?: number;
    status: string;
    rationale: string;
  }[];
}

const INDEX_STRATEGY_DATA: Record<string, Partial<Record<StrategyTab, PillarData>>> = {
  'NIFTY 50': {
    LIQUIDITY: {
      items: [
        { title: 'Buy Side Liquidity (BSL)', val: '22,950', active: true },
        { title: 'Sell Side Liquidity (SSL)', val: '22,780', active: false }
      ],
      signals: [
        { id: 'n-l1', time: '14:24:10', type: 'LIQUIDITY SWEEP', action: 'BUY CE', asset: 'NIFTY 50', strike: 22800, price: 142, status: 'ACTIVE', rationale: 'Day Low swept at 22,780. Aggressive institutional bid absorption. Liquidity grab confirmed.' },
        { id: 'n-l2', time: '11:15:00', type: 'ORDER BLOCK', action: 'BUY PE', asset: 'NIFTY 50', strike: 22900, price: 95, status: 'CLOSED', rationale: 'Tapped unmitigated 15m bearish order block at 22,910. Immediate supply responsive sell-off.' }
      ]
    },
    STOP_HUNTS: {
      items: [
        { title: 'Upper Retail Stops', val: '22,980', active: false },
        { title: 'Lower Retail Stops', val: '22,750', active: true }
      ],
      signals: [
        { id: 'n-s1', time: '13:05:22', type: 'BEAR TRAP', action: 'BUY CE', asset: 'NIFTY 50', strike: 22850, price: 115, status: 'ACTIVE', rationale: 'Forced engineered sell-off breaking down below 22,800 psychological support. Quick retail stops taken out before prompt reversal.' }
      ]
    },
    OI_TRAPS: {
      items: [
        { title: 'Stressed CE Writers', val: '22,900', active: true },
        { title: 'Stressed PE Writers', val: '22,800', active: false }
      ],
      signals: [
        { id: 'n-o1', time: '14:10:00', type: 'CE WRITERS PANIC', action: 'BUY CE', asset: 'NIFTY 50', strike: 22850, price: 130, status: 'ACTIVE', rationale: 'Call writers at 22,900 facing extreme delta pressure as spot pushes above 22,870. Squeeze acceleration imminent.' }
      ]
    },
    MOMENTUM: {
      items: [
        { title: 'Call Delta Spike', val: '+0.38', active: true },
        { title: 'Put Delta Decay', val: '-0.12', active: false }
      ],
      signals: [
        { id: 'n-m1', time: '14:35:00', type: 'GAMMA BLAST', action: 'BUY CE', asset: 'NIFTY 50', strike: 22900, price: 84, status: 'ACTIVE', rationale: 'Violent spike in OTM call delta. Sharp gamma hedging force from market makers driving automated buying program.' }
      ]
    },
    SCALPING: {
      items: [
        { title: 'Pro Long Divergence', val: 'STRONG', active: true },
        { title: 'Retail Trap Flow', val: 'DETECTED', active: true }
      ],
      signals: [
        { id: 'n-sc1', time: '15:10:00', type: 'SMART MONEY REVERSAL', action: 'BUY CE', asset: 'NIFTY 50', strike: 22800, price: 155, status: 'ACTIVE', rationale: 'Late-session short trap. Pro desk absorbing retail panic dump to push prices up for day-end markup.' }
      ]
    }
  },
  'BANK NIFTY': {
    LIQUIDITY: {
      items: [
        { title: 'Buy Side Liquidity (BSL)', val: '49,150', active: true },
        { title: 'Sell Side Liquidity (SSL)', val: '48,720', active: false }
      ],
      signals: [
        { id: 'b-l1', time: '14:24:10', type: 'LIQUIDITY SWEEP', action: 'BUY CE', asset: 'BANK NIFTY', strike: 48900, price: 340, status: 'ACTIVE', rationale: 'Previous Day Low swept at 48,720. Huge volume absorption by institutions. Liquidity grab confirmed.' },
        { id: 'b-l2', time: '13:15:00', type: 'ORDER BLOCK', action: 'BUY PE', asset: 'BANK NIFTY', strike: 49200, price: 110, status: 'CLOSED', rationale: 'Price tapped unmitigated supply order block at 49,150. Liquidity void filled. Reversal expected.' }
      ]
    },
    STOP_HUNTS: {
      items: [
        { title: 'Upper Retail Stops', val: '49,200', active: false },
        { title: 'Lower Retail Stops', val: '48,650', active: true }
      ],
      signals: [
        { id: 'b-s1', time: '14:30:05', type: 'BEAR TRAP', action: 'BUY CE', asset: 'BANK NIFTY', strike: 48800, price: 210, status: 'ACTIVE', rationale: 'Engineered breakdown below support to trigger retail stop losses before markup.' },
        { id: 'b-s2', time: '10:45:20', type: 'BULL TRAP', action: 'BUY PE', asset: 'BANK NIFTY', strike: 49100, price: 180, status: 'CLOSED', rationale: 'Forced breakout above resistance hitting early short stops. Imminent mean reversion.' }
      ]
    },
    OI_TRAPS: {
      items: [
        { title: 'Stressed CE Writers', val: '49,000', active: true },
        { title: 'Stressed PE Writers', val: '48,800', active: false }
      ],
      signals: [
        { id: 'b-o1', time: '11:20:00', type: 'CE WRITERS TRAP', action: 'BUY CE', asset: 'BANK NIFTY', strike: 49000, price: 255, status: 'ACTIVE', rationale: 'Heavy Call Writing (Retail) at resistance broke. Panic short covering imminent. FII holding long.' },
        { id: 'b-o2', time: '09:45:00', type: 'PE WRITERS TRAP', action: 'BUY PE', asset: 'BANK NIFTY', strike: 48800, price: 125, status: 'CLOSED', rationale: 'Highest OI Put support broken on strong volume. Premium expansion due to put writers unwinding.' }
      ]
    },
    MOMENTUM: {
      items: [
        { title: 'Call Delta Spike', val: '+0.72', active: true },
        { title: 'Put Delta Decay', val: '-0.28', active: false }
      ],
      signals: [
        { id: 'b-m1', time: '14:45:00', type: 'GAMMA BLAST', action: 'BUY CE', asset: 'BANK NIFTY', strike: 49200, price: 45, status: 'ACTIVE', rationale: 'Sudden Delta expansion. Option premiums exploding faster than spot due to Gamma squeeze.' },
        { id: 'b-m2', time: '12:30:00', type: 'VOLATILITY EXP', action: 'BUY PE', asset: 'BANK NIFTY', strike: 48500, price: 320, status: 'CLOSED', rationale: 'VIX spike combined with sharp directional breakdown. Institutional momentum algos activated.' }
      ]
    },
    SCALPING: {
      items: [
        { title: 'Pro Long Divergence', val: 'STRONG', active: true },
        { title: 'Retail Trap Flow', val: 'DETECTED', active: true }
      ],
      signals: [
        { id: 'b-sc1', time: '09:35:00', type: 'SMART MONEY REVERSAL', action: 'BUY PE', asset: 'BANK NIFTY', strike: 48900, price: 280, status: 'ACTIVE', rationale: 'Intraday Scalping Liquidity Trap Entry. Pro traders engineering an overthrow to scoop retail stops at Day High.' },
        { id: 'b-sc2', time: '14:15:30', type: 'INTRADAY TRAP SCALP', action: 'BUY CE', asset: 'BANK NIFTY', strike: 48800, price: 95, status: 'CLOSED', rationale: 'Fake breakdown on lower time frames trapping retail shorts. Aggressive Pro buying detected for rapid reversal.' }
      ]
    }
  },
  'FINNIFTY': {
    LIQUIDITY: {
      items: [
        { title: 'Buy Side Liquidity (BSL)', val: '21,780', active: true },
        { title: 'Sell Side Liquidity (SSL)', val: '21,550', active: false }
      ],
      signals: [
        { id: 'f-l1', time: '13:45:12', type: 'LIQUIDITY SWEEP', action: 'BUY CE', asset: 'FINNIFTY', strike: 21600, price: 112, status: 'ACTIVE', rationale: 'Support swept and recovered in a single 5m bar with ultra-high institutional volume profile. Target BSL.' }
      ]
    },
    STOP_HUNTS: {
      items: [
        { title: 'Upper Retail Stops', val: '21,800', active: false },
        { title: 'Lower Retail Stops', val: '21,520', active: true }
      ],
      signals: [
        { id: 'f-s1', time: '11:10:05', type: 'BEAR TRAP', action: 'BUY CE', asset: 'FINNIFTY', strike: 21650, price: 98, status: 'ACTIVE', rationale: 'Manipulated drop below daily pivot targeting retail protective stops before big money expansion.' }
      ]
    },
    OI_TRAPS: {
      items: [
        { title: 'Stressed CE Writers', val: '21,700', active: true },
        { title: 'Stressed PE Writers', val: '21,600', active: false }
      ],
      signals: [
        { id: 'f-o1', time: '10:50:30', type: 'CE WRITERS PANIC', action: 'BUY CE', asset: 'FINNIFTY', strike: 21600, price: 125, status: 'ACTIVE', rationale: 'Sudden call unwinding on FINNIFTY with heavy professional buy orders overriding early resistance block.' }
      ]
    },
    MOMENTUM: {
      items: [
        { title: 'Call Delta Spike', val: '+0.42', active: true },
        { title: 'Put Delta Decay', val: '-0.18', active: false }
      ],
      signals: [
        { id: 'f-m1', time: '14:20:15', type: 'GAMMA SQUEEZE', action: 'BUY CE', asset: 'FINNIFTY', strike: 21700, price: 78, status: 'ACTIVE', rationale: 'Aggressive block market orders on CE side creating gamma hedging feedback loop.' }
      ]
    },
    SCALPING: {
      items: [
        { title: 'Pro Long Divergence', val: 'MODERATE', active: true },
        { title: 'Retail Trap Flow', val: 'MIGRATING', active: true }
      ],
      signals: [
        { id: 'f-sc1', time: '14:55:00', type: 'RAPID SCALP TRAP', action: 'BUY PE', asset: 'FINNIFTY', strike: 21700, price: 104, status: 'ACTIVE', rationale: 'Intraday scalp setup. Smart money trapping late-chasing buyers at temporary range extreme.' }
      ]
    }
  },
  'SENSEX': {
    LIQUIDITY: {
      items: [
        { title: 'Buy Side Liquidity (BSL)', val: '75,700', active: true },
        { title: 'Sell Side Liquidity (SSL)', val: '75,100', active: false }
      ],
      signals: [
        { id: 's-l1', time: '10:25:40', type: 'ORDER BLOCK', action: 'BUY CE', asset: 'SENSEX', strike: 75200, price: 420, status: 'ACTIVE', rationale: 'Mitigation of demand zone. Instant institutional limit order filled. Trend continuation likely.' }
      ]
    },
    STOP_HUNTS: {
      items: [
        { title: 'Upper Retail Stops', val: '75,850', active: false },
        { title: 'Lower Retail Stops', val: '74,950', active: true }
      ],
      signals: [
        { id: 's-s1', time: '14:30:05', type: 'BEAR TRAP', action: 'BUY CE', asset: 'SENSEX', strike: 75300, price: 340, status: 'ACTIVE', rationale: 'Engineered breakdown below support to trigger retail stop losses before markup.' }
      ]
    },
    OI_TRAPS: {
      items: [
        { title: 'Stressed CE Writers', val: '75,600', active: true },
        { title: 'Stressed PE Writers', val: '75,300', active: false }
      ],
      signals: [
        { id: 's-o1', time: '13:40:15', type: 'PE WRITERS PANIC', action: 'BUY PE', asset: 'SENSEX', strike: 75400, price: 290, status: 'ACTIVE', rationale: 'Sharp drop under highest OI support level trigger heavy stop outs from unhedged retail writers.' }
      ]
    },
    MOMENTUM: {
      items: [
        { title: 'Call Delta Spike', val: '+1.12', active: true },
        { title: 'Put Delta Decay', val: '-0.45', active: false }
      ],
      signals: [
        { id: 's-m1', time: '11:15:30', type: 'INSTITUTIONAL MOMENTUM', action: 'BUY CE', asset: 'SENSEX', strike: 75500, price: 380, status: 'ACTIVE', rationale: 'Momentum algos activated at key retracement entry point with massive block buy trade confirmation.' }
      ]
    },
    SCALPING: {
      items: [
        { title: 'Pro Long Divergence', val: 'ACTIVE', active: true },
        { title: 'Retail Trap Flow', val: 'BUILDING', active: true }
      ],
      signals: [
        { id: 's-sc1', time: '15:15:45', type: 'FAST INTRA-DAY TRAP', action: 'BUY CE', asset: 'SENSEX', strike: 75200, price: 460, status: 'ACTIVE', rationale: 'Late-day reversal scalp. Heavy short covering force as retail panic sellers are absorbed by proprietary systems.' }
      ]
    }
  }
};

export default function StrategyDashboard() {
  const [indexStrategyData, setIndexStrategyData] = useState<Record<string, Partial<Record<StrategyTab, PillarData>>>>(INDEX_STRATEGY_DATA);

  // Initialize data with recent times so it feels live
  useEffect(() => {
    const newData = JSON.parse(JSON.stringify(INDEX_STRATEGY_DATA));
    
    Object.keys(newData).forEach(index => {
      Object.keys(newData[index]).forEach(tab => {
        if (!newData[index][tab]) return;
        newData[index][tab].signals.forEach((signal: any, i: number) => {
          const d = new Date();
          // Distribute times incrementally in the last hour
          d.setMinutes(d.getMinutes() - (newData[index][tab].signals.length - i) * 12 - Math.floor(Math.random() * 5));
          signal.time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
        });
      });
    });
    setIndexStrategyData(newData);
    
    // Simulate real-time signal generation
    const interval = setInterval(() => {
        setIndexStrategyData(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            // Just simulate some dynamic updates like new signal or changing status
            const currentIdx = ['NIFTY 50', 'BANK NIFTY', 'FINNIFTY', 'SENSEX'][Math.floor(Math.random() * 4)];
            const tabs = ['LIQUIDITY', 'STOP_HUNTS', 'OI_TRAPS', 'MOMENTUM', 'SCALPING'];
            const randomTab = tabs[Math.floor(Math.random() * tabs.length)] as StrategyTab;
            
            if (next[currentIdx] && next[currentIdx][randomTab] && Math.random() > 0.7) {
                const signals = next[currentIdx][randomTab].signals;
                if (signals.length > 0) {
                    // Update the status of an existing signal
                    const randomSignal = signals[Math.floor(Math.random() * signals.length)];
                    if (randomSignal.status === 'ACTIVE' && Math.random() > 0.5) {
                        randomSignal.status = 'CLOSED';
                        const d = new Date();
                        randomSignal.exitTime = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')} IST`;
                    }
                }
            }
            return next;
        });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const [selectedIndex, setSelectedIndex] = useState<string>('NIFTY 50');
  const [activeTab, setActiveTab] = useState<StrategyTab>('ALL');

  let activePillarData: PillarData;
  if (activeTab === 'ALL') {
    const allSignals: any[] = [];
    const indexData = indexStrategyData[selectedIndex] || {};
    (Object.keys(indexData) as StrategyTab[]).forEach(tab => {
      if (tab === 'ALL' || !indexData[tab]) return;
      allSignals.push(...indexData[tab]!.signals);
    });
    
    allSignals.sort((a, b) => b.time.localeCompare(a.time));

    activePillarData = {
      items: [
        { title: 'Total Active Signatures', val: allSignals.filter(s => s.status === 'ACTIVE').length.toString(), active: true },
        { title: 'Closed / Hit Target', val: allSignals.filter(s => s.status === 'CLOSED').length.toString(), active: false }
      ],
      signals: allSignals
    };
  } else {
    activePillarData = indexStrategyData[selectedIndex]?.[activeTab] || {
      items: [],
      signals: []
    };
  }

  const signals = activePillarData.signals;
  const tabData = tabsConfig[activeTab];
  const Icon = tabData.icon;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Header */}
      <div className="flex border-b border-slate-800 pb-4 mt-4 lg:mt-0 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Crosshair className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Institutional Order Flow</h2>
            <p className="text-slate-400 text-xs font-medium mt-1">Smart Money Core Pillars</p>
          </div>
        </div>
      </div>

      {/* Index Selector */}
      <div className="flex bg-[#1a1c21] border border-slate-800 rounded-lg p-1 w-full max-w-2xl overflow-x-auto">
        {INDEX_CONFIGS.map((idx) => (
          <button
            key={idx.name}
            onClick={() => setSelectedIndex(idx.name)}
            className={cn(
              "flex-1 px-3 sm:px-4 py-2 rounded-md transition-all flex flex-col items-center justify-center min-w-[100px]",
              selectedIndex === idx.name 
                ? "bg-slate-700 text-white shadow-sm" 
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider">{idx.name}</span>
            <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[9px]">
              <span className="text-slate-300">₹{idx.ltp.toFixed(2)}</span>
              <span className={cn(idx.chg >= 0 ? "text-emerald-400" : "text-rose-400")}>
                {idx.chg >= 0 ? '+' : ''}{idx.chg}%
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {(Object.keys(tabsConfig) as StrategyTab[]).map((key) => {
          const config = tabsConfig[key];
          const TabIcon = config.icon;
          const isActive = activeTab === key;
          
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex flex-col items-center justify-center p-3 sm:p-4 rounded border transition-all duration-300",
                isActive 
                  ? "bg-[#1a1c22] border-slate-600 shadow-lg" 
                  : "bg-[#101114] border-slate-800 hover:bg-[#15171a]"
              )}
            >
              <TabIcon className={cn("w-6 h-6 mb-2 transition-colors", isActive ? config.color : "text-slate-600")} />
              <span className={cn(
                "text-[10px] sm:text-xs font-bold uppercase tracking-wider",
                isActive ? "text-white" : "text-slate-500"
              )}>
                {config.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Overview Card */}
      <Card className={cn("bg-[#101114] border-slate-800 border-t-2 transition-colors duration-500", `border-t-[${tabData.color.split('-')[1]}]`)}>
        <CardContent className="p-4 sm:p-5">
           <div className="flex items-start gap-4">
             <div className={cn("p-3 rounded-lg bg-opacity-10 hidden sm:block bg-slate-800")}>
               <Icon className={cn("w-6 h-6", tabData.color)} />
             </div>
             <div className="flex-1 w-full overflow-hidden">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">{tabData.label} Mechanics</h3>
                <p className="text-[11px] text-slate-400 mb-4">{tabData.desc}</p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {activePillarData.items.map((item, i) => (
                    <div key={i} className={cn("flex-1 p-3 rounded-lg border", item.active ? "bg-[#1a1c22] border-slate-600" : "bg-[#15171a] border-slate-800")}>
                       <span className="text-[9px] uppercase font-bold text-slate-500 block mb-1 truncate">{item.title}</span>
                       <span className={cn("text-lg font-mono font-bold block", item.active ? "text-white" : "text-slate-400")}>{item.val}</span>
                       {item.active && (
                         <div className="mt-2 h-1 w-full rounded-full overflow-hidden bg-slate-800">
                           <div className={cn("h-full animate-pulse", tabData.bg)} style={{ width: '100%' }} />
                         </div>
                       )}
                    </div>
                  ))}
                </div>
             </div>
           </div>
        </CardContent>
      </Card>

      {/* Signals Engine */}
      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 mb-2 mt-6">
        <Activity className="w-3.5 h-3.5 text-emerald-500" /> Live {tabData.label} Signatures
      </h3>
      
      {signals.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-xs">
          No live signature triggers detected for {selectedIndex} under {tabData.label}.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {signals.map((signal) => {
            const probability = 70 + (signal.id.charCodeAt(0) + signal.id.charCodeAt(signal.id.length-1) + signal.price) % 25;
            
            const targetPrice = signal.targetPrice || signal.price * (signal.status === 'CLOSED' ? 1.5 : 2.5);
            const stopLoss = signal.stopLoss || signal.price * 0.5;
            
            // Calculate a fake exit time if closed
            let exitTime = signal.exitTime;
            if (signal.status === 'CLOSED' && !exitTime) {
              const [h, m, s] = signal.time.split(':').map(Number);
              const exitD = new Date();
              exitD.setHours(h);
              exitD.setMinutes(m + 15);
              exitD.setSeconds(s || 0);
              exitTime = `${exitD.getHours().toString().padStart(2, '0')}:${exitD.getMinutes().toString().padStart(2, '0')}:${exitD.getSeconds().toString().padStart(2, '0')} IST`;
            }
            const entryTime = signal.time.includes('IST') ? signal.time : `${signal.time} IST`;

            return (
            <Card key={signal.id} className={cn("bg-[#101114] border-slate-800 border-l-2", signal.action.includes('CE') ? "border-l-emerald-500" : "border-l-red-500")}>
              <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-[#15171a]">
                <div className="flex items-center gap-2">
                  <span className={cn("px-1.5 py-0.5 rounded font-bold uppercase text-[9px] border", 
                    signal.action.includes('CE') ? "bg-emerald-950/30 text-emerald-400 border-emerald-900/50" : "bg-red-950/30 text-red-400 border-red-900/50")}>
                    {signal.action}
                  </span>
                  <span className="text-[11px] font-bold text-white tracking-wider flex items-center gap-2">
                    {signal.asset} {signal.strike}
                    <span className="bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-orange-500/50 shadow-[0_0_8px_rgba(249,115,22,0.2)]">
                      PRO SIGNAL
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-[8px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded", signal.status === 'ACTIVE' ? "bg-emerald-500 text-white animate-pulse" : "bg-slate-700 text-slate-300")}>{signal.status}</span>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 text-[9px] text-slate-500 font-mono whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-slate-400">IN:</span> {entryTime}
                    </div>
                    {exitTime && (
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-400">OUT:</span> {exitTime}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <CardContent className="p-3 space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5 block">Signature Type</span>
                        <span className={cn("text-[10px] font-bold uppercase", signal.action.includes('CE') ? "text-emerald-400" : "text-red-400")}>{signal.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center shrink-0 border-l border-slate-800 pl-3">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14" fill="transparent" className="stroke-slate-800" strokeWidth="3" />
                        <circle cx="18" cy="18" r="14" fill="transparent" className={probability >= 85 ? "stroke-emerald-500" : "stroke-amber-500"} strokeWidth="3" strokeDasharray={2 * Math.PI * 14} strokeDashoffset={2 * Math.PI * 14 - (probability / 100) * (2 * Math.PI * 14)} strokeLinecap="round" />
                      </svg>
                      <div className="absolute flex items-center justify-center">
                        <span className="text-[10px] font-black text-white">{probability}%</span>
                      </div>
                    </div>
                    <span className="text-[7.5px] uppercase font-bold text-slate-500 mt-1 tracking-wider">Win Prob</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="bg-[#15171a] p-2 rounded border border-slate-800 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-500 mb-0.5">Entry</span>
                    <span className="text-[12px] font-mono font-extrabold text-indigo-400">₹{signal.price}</span>
                  </div>
                  <div className="bg-[#15171a] p-2 rounded border border-emerald-900/30 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] uppercase font-bold text-emerald-500 mb-0.5">Target</span>
                    <span className="text-[12px] font-mono font-extrabold text-emerald-400 flex items-center justify-center gap-0.5">
                      <Target className="w-3 h-3" /> ₹{parseFloat(targetPrice.toFixed(1))}
                    </span>
                  </div>
                  <div className="bg-[#15171a] p-2 rounded border border-rose-900/30 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] uppercase font-bold text-rose-500 mb-0.5">Stop Loss</span>
                    <span className="text-[12px] font-mono font-extrabold text-rose-400 flex items-center justify-center gap-0.5">
                      <ShieldAlert className="w-3 h-3" /> ₹{parseFloat(stopLoss.toFixed(1))}
                    </span>
                  </div>
                </div>

                <div className="bg-[#1a1c21] p-2 rounded border border-slate-800">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Logic Trace</span>
                  <p className="text-[10px] text-slate-300 italic leading-relaxed">{signal.rationale}</p>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
