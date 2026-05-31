import React, { useEffect, useState, useRef } from 'react';
import { Card } from './ui/Core';
import { ShieldAlert, Target, Zap, Plus, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { MarketSignal } from '../types';
import { toast } from 'sonner';

const playBeep = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.warn('Audio playback failed', e);
  }
};

export default function Signals() {
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const isInitialRender = useRef(true);

  useEffect(() => {
    const q = query(collection(db, 'signals'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newSignals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MarketSignal[];
      setSignals(newSignals);
      
      if (!isInitialRender.current) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data() as MarketSignal;
            playBeep();
            toast.success(`New ${data.type} Signal`, {
              description: `${data.asset} triggered at ${data.level}`,
              duration: 4000,
            });
          }
        });
      } else {
        isInitialRender.current = false;
      }
      
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'signals');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const simulateSignal = async () => {
    const isBuy = Math.random() > 0.5;
    const assets = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'SENSEX'];
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const baseLevel = asset === 'NIFTY' ? 23000 : asset === 'BANKNIFTY' ? 51000 : asset === 'FINNIFTY' ? 22500 : 76000;
    const level = baseLevel + Math.floor(Math.random() * 1000);
    const target = isBuy ? level + 300 : level - 300;
    const stopLoss = isBuy ? level - 150 : level + 150;
    
    // Format timestamp nicely
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    try {
      await addDoc(collection(db, 'signals'), {
        timestamp,
        asset,
        type: isBuy ? 'BUY' : 'SELL',
        level,
        target,
        stopLoss,
        confidence: 0.6 + Math.random() * 0.35,
        reason: 'Algorithmically detected institutional footprint pattern.',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'signals');
    }
  };

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-500" fill="currentColor" />
            Live Trading Signals
          </h2>
          <p className="text-[10px] text-slate-500">Automated real-time alerts streaming from Firestore.</p>
        </div>
        
        <button 
          onClick={simulateSignal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] uppercase font-bold tracking-wider transition-colors shadow-sm"
        >
          <Plus className="w-3 h-3" />
          Simulate Signal
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : signals.length === 0 ? (
        <div className="bg-[#101114] border border-slate-800 rounded-lg p-8 text-center flex flex-col items-center justify-center text-slate-500">
          <Zap className="w-8 h-8 text-slate-700 mb-3" />
          <p className="text-xs uppercase font-bold tracking-widest mb-1">No Active Signals</p>
          <p className="text-[10px] italic max-w-sm">Awaiting real-time triggers from institutional flow monitor via Firestore.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {signals.map((signal) => (
            <div key={signal.id}>
              <Card className={cn("border-l-2 h-full bg-[#101114] shadow-none flex flex-col animate-in fade-in zoom-in-95 duration-500", signal.type === 'BUY' ? "border-l-emerald-500" : "border-l-red-500")}>
                <div className="flex items-center justify-between p-2.5 border-b border-slate-800/50">
                  <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider">
                    <div className={cn("px-1 py-0.5 font-bold rounded", signal.type === 'BUY' ? "bg-emerald-500 text-black" : "bg-red-500 text-black")}>
                      {signal.type}
                    </div>
                    <span className={cn("font-bold", signal.type === 'BUY' ? "text-emerald-400" : "text-red-400")}>{signal.asset}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono tracking-widest">{signal.timestamp}</span>
                </div>
                
                <div className="p-3 flex-1 flex flex-col gap-3">
                  <div className="flex justify-between items-end border-b border-slate-800/50 pb-2">
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Trigger Level</p>
                      <p className="text-lg font-bold text-white font-mono">{signal.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Conviction</p>
                      <p className="text-sm font-bold font-mono text-blue-400">{(signal.confidence * 100).toFixed(0)}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-[#1a1c21] rounded p-2 border border-slate-800">
                      <div className="flex items-center gap-1 text-slate-500 font-bold uppercase tracking-widest mb-1">
                        <Target className="w-3 h-3" /> Target
                      </div>
                      <p className="text-emerald-400 font-mono font-bold text-sm">{signal.target}</p>
                    </div>
                    <div className="bg-[#1a1c21] rounded p-2 border border-slate-800">
                      <div className="flex items-center gap-1 text-slate-500 font-bold uppercase tracking-widest mb-1">
                        <ShieldAlert className="w-3 h-3" /> SL
                      </div>
                      <p className="text-red-400 font-mono font-bold text-sm">{signal.stopLoss}</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 border border-slate-700/50 rounded p-2 text-[10px] text-slate-300 italic flex-1">
                    <span className="font-bold text-slate-500 uppercase not-italic tracking-wider text-[9px] block mb-1">Logic Pattern</span>
                    {signal.reason}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
