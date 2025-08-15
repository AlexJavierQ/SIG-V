"use client";

import React from 'react';
import { Target, TrendingUp } from 'lucide-react';

export default function CampaignPerformanceChart() {
    const campaigns = [
        { name: 'Google Ads', impressions: 125000, clicks: 4200, conversions: 89, spend: 2500 },
        { name: 'Facebook', impressions: 98000, clicks: 2800, conversions: 67, spend: 1800 },
        { name: 'Instagram', impressions: 156000, clicks: 5100, conversions: 112, spend: 3200 },
        { name: 'LinkedIn', impressions: 45000, clicks: 890, conversions: 34, spend: 1200 },
    ];

    const maxImpressions = Math.max(...campaigns.map(c => c.impressions));

    return (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                        <Target className="w-5 h-5 text-emerald-400" />
                        Rendimiento de Campañas
                    </h3>
                    <p className="text-slate-400 text-sm">Métricas por canal</p>
                </div>
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">+18.5%</span>
                </div>
            </div>

            <div className="space-y-6">
                {campaigns.map((campaign, index) => {
                    const ctr = ((campaign.clicks / campaign.impressions) * 100).toFixed(2);
                    const conversionRate = ((campaign.conversions / campaign.clicks) * 100).toFixed(1);
                    const cpc = (campaign.spend / campaign.clicks).toFixed(2);

                    return (
                        <div key={index} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-slate-300 font-medium">{campaign.name}</h4>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-slate-400">CTR: {ctr}%</span>
                                    <span className="text-emerald-400 font-semibold">{campaign.conversions} conv.</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-3 text-xs">
                                <div className="text-center">
                                    <div className="text-slate-400">Impresiones</div>
                                    <div className="text-white font-semibold">{(campaign.impressions / 1000).toFixed(0)}K</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-slate-400">Clicks</div>
                                    <div className="text-blue-400 font-semibold">{campaign.clicks.toLocaleString()}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-slate-400">Conv. Rate</div>
                                    <div className="text-green-400 font-semibold">{conversionRate}%</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-slate-400">CPC</div>
                                    <div className="text-orange-400 font-semibold">${cpc}</div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="w-full bg-slate-700 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-1000 ${index === 0 ? 'bg-emerald-400' :
                                                index === 1 ? 'bg-blue-400' :
                                                    index === 2 ? 'bg-purple-400' :
                                                        'bg-orange-400'
                                            }`}
                                        style={{ width: `${(campaign.impressions / maxImpressions) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-600/50">
                <div className="grid grid-cols-4 gap-4 text-center text-sm">
                    <div>
                        <div className="text-slate-400">Total Impresiones</div>
                        <div className="text-white font-semibold">
                            {(campaigns.reduce((sum, c) => sum + c.impressions, 0) / 1000).toFixed(0)}K
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400">Total Clicks</div>
                        <div className="text-blue-400 font-semibold">
                            {campaigns.reduce((sum, c) => sum + c.clicks, 0).toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400">Total Conversiones</div>
                        <div className="text-green-400 font-semibold">
                            {campaigns.reduce((sum, c) => sum + c.conversions, 0)}
                        </div>
                    </div>
                    <div>
                        <div className="text-slate-400">Gasto Total</div>
                        <div className="text-orange-400 font-semibold">
                            ${campaigns.reduce((sum, c) => sum + c.spend, 0).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}