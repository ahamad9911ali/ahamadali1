import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from './ui/Core';
import { mockParticipantData } from '../data/marketData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { format } from 'date-fns';
import { Timeframe } from '../types';

export default function ParticipantOI() {
  const [metric, setMetric] = useState<'netOptions' | 'futuresNet'>('netOptions');
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');

  // Filter data based on timeframe
  const filteredData = React.useMemo(() => {
    const days = timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 90;
    return mockParticipantData.slice(-Math.min(days, mockParticipantData.length));
  }, [timeframe]);

  // Transform data for Recharts
  const chartData = filteredData.map(day => ({
    date: format(new Date(day.date), 'dd MMM'),
    FII: metric === 'netOptions' ? day.fii.netOptions : (day.fii.futuresLong - day.fii.futuresShort),
    DII: metric === 'netOptions' ? day.dii.netOptions : (day.dii.futuresLong - day.dii.futuresShort),
    Pro: metric === 'netOptions' ? day.pro.netOptions : (day.pro.futuresLong - day.pro.futuresShort),
    Client: metric === 'netOptions' ? day.client.netOptions : (day.client.futuresLong - day.client.futuresShort),
  }));

  const latest = mockParticipantData[mockParticipantData.length - 1];
  const [selectedDate, setSelectedDate] = useState<string>(latest.date);

  // Selected date data
  const selectedData = React.useMemo(() => {
    return mockParticipantData.find(d => d.date === selectedDate) || latest;
  }, [selectedDate, latest]);

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-sm font-bold text-white">Participant Wise OI</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Smart Money tracking - FII, DII, Pro & Client</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex bg-[#1a1c21] border border-slate-800 rounded p-0.5">
            <select 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-[10px] font-bold text-slate-300 uppercase outline-none px-2 py-1 cursor-pointer"
            >
              {[...mockParticipantData].reverse().map(d => (
                <option key={d.date} value={d.date} className="bg-[#1a1c21]">{format(new Date(d.date), 'dd MMM yyyy')}</option>
              ))}
            </select>
          </div>

          <div className="flex bg-[#1a1c21] border border-slate-800 rounded p-0.5">

            <button 
              onClick={() => setMetric('netOptions')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${metric === 'netOptions' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Net Options
            </button>
            <button 
              onClick={() => setMetric('futuresNet')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${metric === 'futuresNet' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Net Futures
            </button>
          </div>
          
          <div className="flex bg-[#1a1c21] border border-slate-800 rounded p-0.5">
            {(['1W', '1M', '3M'] as Timeframe[]).map((tf) => (
              <button 
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${timeframe === tf ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { name: 'FII (Foreign Inst)', data: selectedData.fii, color: 'border-emerald-500', bg: 'bg-[#1a1c21]' },
          { name: 'DII (Domestic Inst)', data: selectedData.dii, color: 'border-blue-500', bg: 'bg-[#1a1c21]' },
          { name: 'Pro (Proprietary)', data: selectedData.pro, color: 'border-purple-500', bg: 'bg-[#1a1c21]' },
          { name: 'Client (Retail)', data: selectedData.client, color: 'border-orange-500', bg: 'bg-[#1a1c21]' },
        ].map((participant) => {
          const isBullish = participant.data.netOptions > 0;
          const isBearish = participant.data.netOptions < 0;
          return (
            <div key={participant.name}>
              <div className={`p-3 rounded border-l-2 ${participant.color} ${participant.bg} border border-slate-800 h-full flex flex-col justify-between`}>
                <div>
                  <h3 className="text-[10px] font-bold text-slate-500 mb-2.5 uppercase tracking-wider">{participant.name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-end border-b border-slate-800 pb-1.5">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Net Options OI</span>
                      <span className={`text-sm font-bold font-mono ${isBullish ? 'text-emerald-400' : isBearish ? 'text-red-400' : 'text-slate-300'}`}>
                        {isBullish ? '+' : ''}{(participant.data.netOptions / 100000).toFixed(2)}L
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 uppercase tracking-wider font-bold">Fut Long</span>
                      <span className="font-mono text-slate-300">{participant.data.futuresLong}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 uppercase tracking-wider font-bold">Fut Short</span>
                      <span className="font-mono text-slate-300">{participant.data.futuresShort}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] pt-2 mt-2 border-t border-slate-800/50">
                  <span className="text-slate-500 uppercase tracking-wider font-bold">Summary Bias</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded ${isBullish ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/50' : isBearish ? 'bg-red-950/30 text-red-400 border border-red-900/50' : 'bg-slate-800 text-slate-300'}`}>
                    {isBullish ? 'BULLISH' : isBearish ? 'BEARISH' : 'NEUTRAL'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>


      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Trend ({metric === 'netOptions' ? 'Index Options Net OI' : 'Index Futures Net OI'})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} tickFormatter={(val) => `${(val / 100000).toFixed(1)}L`} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#1e293b', opacity: 0.4}}
                  contentStyle={{ backgroundColor: '#0d0f12', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '4px', fontSize: '10px' }}
                  itemStyle={{ fontFamily: 'JetBrains Mono' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '10px' }} />
                <Bar dataKey="FII" fill="#10b981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="DII" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Pro" fill="#a855f7" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Client" fill="#f97316" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
