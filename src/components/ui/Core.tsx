import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("bg-[#101114] border border-slate-800 rounded min-w-0 overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("px-3 py-2 border-b border-slate-800/50", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={cn("text-[10px] font-bold tracking-widest uppercase text-slate-500 flex justify-between items-center w-full", className)}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("p-3", className)}>
      {children}
    </div>
  );
}

export function Badge({ children, variant = 'default', className }: { children: React.ReactNode; variant?: 'default'|'success'|'danger'|'warning', className?: string }) {
  const variants = {
    default: "bg-slate-800/30 text-slate-400 border-slate-700",
    success: "bg-emerald-950/20 text-emerald-400 border-emerald-900/50",
    danger: "bg-red-950/20 text-red-400 border-red-900/50",
    warning: "bg-orange-950/20 text-orange-400 border-orange-900/50"
  };
  
  return (
    <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border", variants[variant], className)}>
      {children}
    </span>
  );
}
