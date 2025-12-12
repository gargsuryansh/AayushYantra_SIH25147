"use client";

import React from "react";
import Link from "next/link";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function HistoryPage() {
    const [history, setHistory] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetch last 100 points for history view
                const res = await fetch('/api/thingspeak?limit=100');
                const data = await res.json();
                if (data.history) {
                    const formattedHistory = data.history.map((item: any) => ({
                        ...item,
                        time: new Date(item.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })
                    }));
                    setHistory(formattedHistory);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1">
                        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-white/10 px-4 md:px-10 py-4 transition-colors">
                            <div className="flex items-center gap-4">
                                <Link href="/dashboard" className="text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                                </Link>
                                <h1 className="text-gray-900 dark:text-white text-xl font-bold transition-colors">Session History</h1>
                            </div>
                        </header>
                        <main className="flex-grow p-4 md:p-6 lg:p-10">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2 rounded-xl border border-gray-200 dark:border-white/10 p-6 bg-white dark:bg-white/5 min-h-[500px] shadow-sm dark:shadow-none transition-all">
                                    <p className="text-gray-900 dark:text-white text-base font-medium leading-normal mb-4 transition-colors">
                                        Temperature History (Last 100 Readings)
                                    </p>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <AreaChart data={history.length > 0 ? history : []}>
                                            <defs>
                                                <linearGradient id="colorTempHistory" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#06bedb" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#06bedb" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                            <XAxis
                                                dataKey="time"
                                                tick={{ fill: '#aaa', fontSize: 12 }}
                                            />
                                            <YAxis
                                                domain={['auto', 'auto']}
                                                tick={{ fill: '#aaa', fontSize: 12 }}
                                                tickFormatter={(value) => `${value}°C`}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                                labelStyle={{ color: '#aaa' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="temperature"
                                                stroke="#06bedb"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorTempHistory)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                    {history.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-white/40">
                                            No history data available
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 dark:border-white/10 p-6 bg-white dark:bg-white/5 shadow-sm dark:shadow-none transition-all">
                                <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4 transition-colors">Detailed Data Log</h3>
                                <div className="overflow-x-auto max-h-[400px]">
                                    <table className="w-full text-left text-gray-700 dark:text-white/80 transition-colors">
                                        <thead className="sticky top-0 bg-gray-100 dark:bg-[#1e1e1e] transition-colors">
                                            <tr className="border-b border-gray-200 dark:border-white/10 transition-colors">
                                                <th className="p-3 font-medium text-gray-900 dark:text-white transition-colors">Time</th>
                                                <th className="p-3 font-medium text-gray-900 dark:text-white transition-colors">Temperature</th>
                                                <th className="p-3 font-medium text-gray-900 dark:text-white transition-colors">Date & Time (Full)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.slice().reverse().map((item, index) => (
                                                <tr key={index} className="border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="p-3">{item.time}</td>
                                                    <td className="p-3 font-bold text-[#06bedb]">{item.temperature} °C</td>
                                                    <td className="p-3 text-sm text-gray-500 dark:text-white/40 transition-colors">{new Date(item.timestamp).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {history.length === 0 && (
                                        <div className="p-8 text-center text-white/40">
                                            Loading history data...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div >
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
            />
        </div >
    );
}
