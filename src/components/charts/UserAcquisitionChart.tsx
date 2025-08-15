"use client";

import React from 'react';
import { Users, TrendingUp } from 'lucide-react';

export default function UserAcquisitionChart() {
    // Datos simulados para adquisición de usuarios
    const data = [
        { channel: 'Orgánico', users: 1250, cost: 0, cpa: 0, growth: 15.2 },
        { channel: 'Google Ads', users: 890, cost: 2500, cpa: 2.81, growth: 8.7 },
        { channel: 'Facebook', users: 650, cost: 1800, cpa: 2.77, growth: 22.1 },
        { channel: 'Instagram', users: 420, cost: 1200, cpa: 2.86, growth: 18.5 },
        { channel: 'LinkedIn', users: 180, cost: 800, cpa: 4.44, growth: 5.3 },
        { channel: 'Email', users: 320, cost: 200, cpa: 0.63, growth: 12.8 },
    ];

    const totalUsers = data.reduce((sum, item) => sum + item.users, 0);
    const maxUsers = Math.max(...data.map(item => item.users));

    return (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        Adquisición de Usuarios
                    </h3>
                    <p className="text-slate-400 text-sm">Por canal de marketing</p>
                </div>
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">+14.2%</span>
                </div>
            </div>

            <div className="space-y-4">
                {data.map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-emerald-400' :
                                        index === 1 ? 'bg-blue-400' :
                                            index === 2 ? 'bg-purple-400' :
                                                index === 3 ? 'bg-pink-400' :
                                                    index === 4 ? 'bg-orange-400' :
                                                        'bg-yellow-400'
                                    }`}></div>
                                <span className="text-slate-300 font-medium">{item.channel}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-slate-400">
                                    {((item.users / totalUsers) * 100).toFixed(1)}%
                                </span>
                                <span className="text-blue-400 font-semibold">
                                    {item.users.toLocaleString()} usuarios
                                </span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="w-full bg-slate-700 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-1000 ${index === 0 ? 'bg-emerald-400' :
                                            index === 1 ? 'bg-blue-400' :
                                                index === 2 ? 'bg-purple-400' :
                                                    index === 3 ? 'bg-pink-400' :
                                                        index === 4 ? 'bg-orange-400' :
                                                            'bg-yellow-400'
                                        }`}
                                    style={{ width: `${(item.users / maxUsers) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-4">
                                {item.cost > 0 && (
                                    <span className="text-slate-400">
                                        CPA: ${item.cpa.toFixed(2)}
                                    </span>
                                )}
                                <span className={`font-medium ${item.growth >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {item.growth >= 0 ? '+' : ''}{item.growth}%
                                </span>
                            </div>
                            {item.cost > 0 && (
                                <span className="text-slate-400">
                                    Gasto: ${item.cost.toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-600/50">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                        <div className="text-slate-400">Total Usuarios</div>
                        <div className="text-white font-semibold text-lg">
                            {totalUsers.toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400">Gasto Total</div>
                        <div className="text-orange-400 font-semibold text-lg">
                            ${data.reduce((sum, item) => sum + item.cost, 0).toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400">CPA Promedio</div>
                        <div className="text-blue-400 font-semibold text-lg">
                            ${(data.reduce((sum, item) => sum + (item.cost > 0 ? item.cpa : 0), 0) / data.filter(item => item.cost > 0).length).toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}