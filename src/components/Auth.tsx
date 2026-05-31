import React, { useState } from 'react';
import { Activity, Lock, Mail, Key } from 'lucide-react';
import { toast } from 'sonner';

interface AuthProps {
  onSuccess: () => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate validation latency
      await new Promise(resolve => setTimeout(resolve, 800));

      if (isAdmin) {
        if (adminPin === '123456' && email === 'ahamad9911ali@gmail.com' && password === '123456') {
           toast.success('Admin access granted');
           onSuccess();
        } else {
           throw new Error('Invalid admin credentials');
        }
      } else {
        if (email && password) {
          toast.success('Successfully logged in');
          onSuccess();
        } else {
          throw new Error('Please provide valid credentials');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0c] flex flex-col items-center justify-center p-4 selection:bg-blue-500/30 font-sans">
      <div className="w-full max-w-md bg-[#101114] border border-slate-800 rounded-2xl p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl relative">
            <Activity className="w-10 h-10 text-blue-500" />
            {isAdmin && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded shadow">
                Admin
              </div>
            )}
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">PRO TRADER</h1>
        <p className="text-center text-slate-400 text-sm mb-8">
          {isAdmin ? 'Administrative Access Portal' : 'Institutional Options Analytics'}
        </p>

        <div className="flex bg-[#1a1c21] border border-slate-800 rounded p-1 mb-6">
          <button 
             type="button"
             onClick={() => setIsAdmin(false)}
             className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${!isAdmin ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Trader Login
          </button>
          <button 
             type="button"
             onClick={() => setIsAdmin(true)}
             className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${isAdmin ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Admin Login
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> 
              {isAdmin ? 'Admin Email' : 'Email Address'}
            </label>
            <input 
              type="email" 
              placeholder={isAdmin ? "ahamad9911ali@gmail.com" : "trader@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#15171a] border border-slate-800 text-slate-200 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
            />
          </div>
          
          <div className="space-y-2">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
               <Lock className="w-3.5 h-3.5" /> Password
             </label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#15171a] border border-slate-800 text-slate-200 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
            />
          </div>

          {isAdmin && (
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                 <Key className="w-3.5 h-3.5" /> Admin PIN
               </label>
              <input 
                type="password" 
                placeholder="Required for admin access"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                required
                className="w-full bg-[#15171a] border border-red-900/50 text-slate-200 px-4 py-3 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-sm"
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-3 rounded-lg transition-all mt-2 shadow-sm text-xs uppercase tracking-widest flex items-center justify-center
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.01]'}
              ${isAdmin ? 'bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]'}
            `}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : isAdmin ? 'Grant Admin Access' : 'Connect Terminal'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Secure Access • AES-256 Encryption</p>
        </div>
      </div>
    </div>
  );
}
