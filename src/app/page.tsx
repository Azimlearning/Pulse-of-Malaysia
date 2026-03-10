'use client';

import React, { useEffect, useState } from 'react';
import StateCard from '@/components/StateCard';

interface DataPoint {
  state: string;
  suicides_2023: number;
  u_rate: number;
  risk_score: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    // For the prototype, we'll fetch our master_crisis_data.csv (if possible) 
    // or use a hardcoded version injected via the build step
    const mockData: DataPoint[] = [
      { state: "Selangor", suicides_2023: 305, u_rate: 3.5, risk_score: 84.5 },
      { state: "W.P. Kuala Lumpur", suicides_2023: 135, u_rate: 3.5, risk_score: 45.4 },
      { state: "Johor", suicides_2023: 123, u_rate: 3.1, risk_score: 41.1 },
      { state: "Pulau Pinang", suicides_2023: 123, u_rate: 2.9, risk_score: 40.1 },
      { state: "Perak", suicides_2023: 85, u_rate: 4.4, risk_score: 37.7 },
      { state: "Kedah", suicides_2023: 60, u_rate: 3.1, risk_score: 26.7 },
      { state: "Sarawak", suicides_2023: 50, u_rate: 4.0, risk_score: 27.9 },
      { state: "Sabah", suicides_2023: 45, u_rate: 7.3, risk_score: 40.3 }
    ];
    setData(mockData);
    setLoading(false);
  }, []);

  return (
    <main className="min-h-screen p-8 md:p-12 lg:p-16 space-y-12 bg-[#050505]">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="bg-sdg3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">SDG 3</span>
            <span className="bg-sdg8 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">SDG 8</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-white">
            Resilience <span className="text-blue-500 italic">Radar</span>
          </h1>
          <p className="text-gray-400 max-w-xl text-lg">
            Mental Health & Economic Vulnerability Analytics Dashboard. Mapping crisis hotspots and mental health access disparities across Malaysia.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="glass px-6 py-4 rounded-xl text-center glow-sdg3">
            <div className="text-sdg3 text-3xl font-black">1,068</div>
            <div className="text-xs text-gray-400 uppercase font-bold">Total Cases (2023)</div>
          </div>
          <div className="glass px-6 py-4 rounded-xl text-center glow-sdg8">
            <div className="text-sdg8 text-3xl font-black">3.2</div>
            <div className="text-xs text-gray-400 uppercase font-bold">Mortality Rate / 100k</div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 glass rounded-3xl min-h-[400px] flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
          <div className="z-10 text-center space-y-4">
            <div className="text-4xl font-bold text-white/20 group-hover:text-blue-500/40 transition-colors">
              GEOSPATIAL HEATMAP
            </div>
            <p className="text-gray-500 font-mono text-sm uppercase">Interactive JavaScript Map Integration Pending</p>
            <div className="flex justify-center gap-2">
              {['#4C9F38', '#A21942', '#3b82f6'].map(c => (
                <div key={c} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl border-l-4 border-sdg3">
            <h2 className="text-2xl font-bold mb-4">Crisis Hotspots</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(n => <div key={n} className="h-20 bg-white/5 rounded-xl"></div>)}
                </div>
              ) : (
                data.slice(0, 4).map(item => (
                  <div key={item.state} className="flex justify-between items-center bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors">
                    <span className="font-semibold">{item.state}</span>
                    <span className="text-red-400 font-bold">{item.suicides_2023} cases</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border-l-4 border-sdg8">
            <h2 className="text-2xl font-bold mb-4">Risk Predictor</h2>
            <p className="text-sm text-gray-400 mb-6 font-mono italic">"Economic stress is the primary antecedent for 2023 hotspots."</p>
            <button className="w-full py-4 bg-sdg8 hover:bg-red-700 rounded-xl font-bold transition-all transform hover:translate-y-[-2px] active:scale-95 shadow-lg shadow-red-900/20">
              RUN SIMULATION
            </button>
          </div>
        </div>
      </section>

      {/* Grid List */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Regional Risk Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item) => (
            <StateCard
              key={item.state}
              state={item.state}
              suicides={item.suicides_2023}
              uRate={item.u_rate}
              riskScore={item.risk_score}
            />
          ))}
        </div>
      </section>

      {/* Footer / Logos */}
      <footer className="pt-16 pb-8 flex flex-wrap items-center justify-between gap-8 border-t border-white/10">
        <div className="flex items-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
          <div className="text-white font-black text-2xl uppercase tracking-widest">UKM</div>
          <div className="h-8 w-px bg-white/20"></div>
          <div className="text-gray-400 text-sm font-bold">DATA CHALLENGE 5.0</div>
        </div>
        <div className="text-gray-500 text-sm">
          Strictly using OpenDOSM & MOH official data sources.
        </div>
      </footer>
    </main>
  );
}
