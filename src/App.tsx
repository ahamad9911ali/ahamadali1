import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ParticipantOI from './components/ParticipantOI';
import OptionChain from './components/OptionChain';
import StrategyDashboard from './components/StrategyDashboard';
import OIAnalytics from './components/OIAnalytics';
import InstitutionalStock from './components/InstitutionalStock';
import ProFiiIndex from './components/ProFiiIndex';
import SectorRotation from './components/SectorRotation';
import PennyStock from './components/PennyStock';
import AlgoTraps from './components/AlgoTraps';
import OptionMomentum from './components/OptionMomentum';
import StockFinder from './components/StockFinder';
import ExpiryExpert from './components/ExpiryExpert';
import SLHunter from './components/SLHunter';
import Auth from './components/Auth';
import { ViewState } from './types';
import { Activity } from 'lucide-react';
import { Toaster } from 'sonner';
import MarketStatusHeader from './components/MarketStatusHeader';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  if (!isAuthenticated) {
    return (
      <>
        <Auth onSuccess={() => setIsAuthenticated(true)} />
        <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: '#101114', border: '1px solid #1e293b', color: '#f8fafc' } }} />
      </>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'participant': return <ParticipantOI />;
      case 'optionChain': return <OptionChain />;
      case 'strategy': return <StrategyDashboard />;
      case 'oiAnalytics': return <OIAnalytics />;
      case 'institutionalStock': return <InstitutionalStock />;
      case 'proFiiIndex': return <ProFiiIndex />;
      case 'sectorRotation': return <SectorRotation />;
      case 'pennyStock': return <PennyStock />;
      case 'algoTraps': return <AlgoTraps />;
      case 'optionMomentum': return <OptionMomentum />;
      case 'stockFinder': return <StockFinder />;
      case 'expiryExpert': return <ExpiryExpert />;
      case 'slHunter': return <SLHunter />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#090a0c] text-slate-300 selection:bg-blue-500/30 font-sans">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        onLogout={() => setIsAuthenticated(false)} 
      />
      
      {/* Mobile nav indicator - very simple */}
      <div className="md:hidden fixed top-0 w-full bg-[#15171a] border-b border-slate-800 p-3 z-50 flex justify-between items-center">
         <div className="flex items-center gap-2">
           <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
           <h1 className="text-sm font-bold text-white tracking-tight uppercase">INSTI-FLOW</h1>
         </div>
         <select 
           value={currentView} 
           onChange={(e) => setCurrentView(e.target.value as ViewState)}
           className="bg-[#0d0f12] border border-slate-800 text-[10px] py-1 px-2 rounded max-w-[120px] text-white"
         >
           <option value="dashboard">Overview</option>
           <option value="participant">Participant Flow</option>
           <option value="optionChain">Option Chain</option>
           <option value="strategy">Smart Money</option>
           <option value="oiAnalytics">OI Analytics</option>
           <option value="institutionalStock">Pro Stock Data</option>
           <option value="proFiiIndex">Index Strategy Builder</option>
           <option value="sectorRotation">Sector Rotation</option>
           <option value="pennyStock">Penny Stocks &lt; 500</option>
           <option value="algoTraps">Algo Traps</option>
           <option value="optionMomentum">Option Momentum</option>
           <option value="stockFinder">Stock Finder</option>
           <option value="expiryExpert">Expiry 0-DTE</option>
           <option value="slHunter">SL Hunter</option>
         </select>
      </div>

      <main className="flex-1 text-[11px] overflow-auto pt-14 md:pt-0">
        <div className="p-3 lg:p-4 grid gap-3 max-w-[1600px] mx-auto min-w-0">
          <MarketStatusHeader />
          {renderView()}
        </div>
      </main>
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: '#101114', border: '1px solid #1e293b', color: '#f8fafc' } }} />
    </div>
  );
}
