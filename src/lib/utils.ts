import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 100000) return (num / 100000).toFixed(2) + 'L';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

/**
 * Generates realistic placeholder option chain data around a spot price
 */
export function generateOptionChain(spot: number, step: number = 100): Array<any> {
    const chain = [];
    const baseStrike = Math.round(spot / step) * step;
    
    for (let i = -10; i <= 10; i++) {
        const strike = baseStrike + (i * step);
        const distance = Math.abs(i);
        const ceLtp = Math.max(0.5, 400 - (distance * 35) - (i * 15));
        const peLtp = Math.max(0.5, 400 - (distance * 35) + (i * 15));
        
        chain.push({
            strike,
            ce: {
                oi: Math.floor(Math.random() * 50000) + (distance === 2 ? 100000 : 0),
                oiChange: Math.floor(Math.random() * 20000) - 10000,
                volume: Math.floor(Math.random() * 200000),
                ltp: parseFloat(ceLtp.toFixed(1)),
                iv: 14 + Math.random() * 5,
                trending: Math.random() > 0.8
            },
            pe: {
                oi: Math.floor(Math.random() * 50000) + (distance === 3 ? 120000 : 0),
                oiChange: Math.floor(Math.random() * 20000) - 10000,
                volume: Math.floor(Math.random() * 200000),
                ltp: parseFloat(peLtp.toFixed(1)),
                iv: 15 + Math.random() * 5,
                trending: Math.random() > 0.8
            }
        });
    }
    return chain;
}
