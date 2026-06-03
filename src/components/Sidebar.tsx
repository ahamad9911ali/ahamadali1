import React from 'react';
import { LayoutDashboard, Users, List, Zap, LogOut, Target, Briefcase, Search, LineChart, IndianRupee, ShieldAlert, Rocket } from 'lucide-react';
import { ViewState } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
}

export default function Sidebar({ currentView, onChangeView, onLogout }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'expiryExpert', label: 'Expiry 0-DTE', icon: Zap },
    { id: 'slHunter', label: 'SL Hunter', icon: Target },
    { id: 'participant', label: 'Participant Flow', icon: Users },
    { id: 'optionChain', label: 'Option Chain', icon: List },
    { id: 'strategy', label: 'Smart Money', icon: Briefcase },
    { id: 'oiAnalytics', label: 'OI Analytics', icon: Target },
    { id: 'institutionalStock', label: 'Pro Stock', icon: LineChart },
    { id: 'proFiiIndex', label: 'Index Strategy Builder', icon: Target },
    { id: 'sectorRotation', label: 'Sector Rotation', icon: Target },
    { id: 'pennyStock', label: 'Penny Stocks', icon: IndianRupee },
    { id: 'algoTraps', label: 'Algo Traps', icon: ShieldAlert },
    { id: 'optionMomentum', label: 'Option Momentum', icon: Rocket },
    { id: 'stockFinder', label: 'Stock Finder', icon: Search },
  ] as const;

  return (
    <aside className="w-56 flex flex-col bg-[#0d0f12] border-r border-slate-800 h-screen sticky top-0 hidden md:flex shrink-0">
      <div className="p-4 border-b border-slate-800 bg-[#15171a]">
        <div className="flex items-center gap-2 mb-1 text-white">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          <h1 className="font-bold tracking-wider text-sm">PRO TRADER</h1>
        </div>
        <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase ml-4">Terminal Connected</p>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 mt-4">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded text-[11px] font-medium transition-all duration-200 uppercase tracking-wide",
                isActive 
                  ? "bg-blue-500/10 text-white border-l-2 border-blue-500" 
                  : "text-slate-500 hover:bg-slate-800/40 hover:text-slate-300 border-l-2 border-transparent"
              )}
            >
              <item.icon className={cn("w-3.5 h-3.5", isActive ? "text-blue-500" : "text-slate-600")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <div className="bg-[#1a1c21] rounded p-3 flex justify-between items-center border border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-[9px] text-slate-300 font-bold border border-slate-700">
              PA
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-bold text-white uppercase">Pro Account</span>
              <span className="text-[8px] text-slate-500 uppercase tracking-wider font-mono">Live API</span>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors rounded"
            title="Disconnect Terminal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
