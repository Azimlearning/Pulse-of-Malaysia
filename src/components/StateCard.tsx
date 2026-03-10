import React from 'react';

interface StateCardProps {
    state: string;
    suicides: number;
    uRate: number;
    riskScore: number;
}

const StateCard: React.FC<StateCardProps> = ({ state, suicides, uRate, riskScore }) => {
    const getRiskColor = (score: number) => {
        if (score > 60) return 'text-red-500';
        if (score > 30) return 'text-amber-500';
        return 'text-emerald-500';
    };

    return (
        <div className="glass p-6 rounded-2xl flex flex-col gap-4 hover:scale-[1.02] transition-transform cursor-pointer group">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {state}
                </h3>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getRiskColor(riskScore)} bg-white/5`}>
                    Risk: {riskScore.toFixed(1)}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Suicides (2023)</span>
                    <span className="text-2xl font-semibold text-white">{suicides}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Unemployment</span>
                    <span className="text-2xl font-semibold text-white">{uRate.toFixed(1)}%</span>
                </div>
            </div>

            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-red-500"
                    style={{ width: `${riskScore}%` }}
                ></div>
            </div>
        </div>
    );
};

export default StateCard;
