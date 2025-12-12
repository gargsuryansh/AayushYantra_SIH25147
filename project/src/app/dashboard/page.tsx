"use client";

import React from "react";
import Image from "next/image";
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

export default function DashboardPage() {
    const [time, setTime] = React.useState(0);
    const [isRunning, setIsRunning] = React.useState(false);
    const [socketPosition, setSocketPosition] = React.useState("");
    const [temperature, setTemperature] = React.useState<number | null>(null);
    const [startTemp, setStartTemp] = React.useState<number | null>(null);
    const [history, setHistory] = React.useState<any[]>([]);
    const [sessionStartTime, setSessionStartTime] = React.useState<number>(0);
    const [error, setError] = React.useState("");

    // AI Prediction State
    const [predictionInputs, setPredictionInputs] = React.useState({
        initial_temp_C: "",
        time_to_50C_sec: ""
    });
    const [predictionResult, setPredictionResult] = React.useState<{ recommended_temp: number; recommended_dwell: number } | null>(null);
    const [isPredicting, setIsPredicting] = React.useState(false);
    const [predictionError, setPredictionError] = React.useState("");

    React.useEffect(() => {
        const fetchLatest = async () => {
            if (!isRunning) return;
            try {
                const res = await fetch('/api/thingspeak');
                const data = await res.json();
                if (data.temperature && data.lastUpdate) {
                    const dataTime = new Date(data.lastUpdate).getTime();

                    if (isRunning && startTemp === null) {
                        setStartTemp(data.temperature);
                    }

                    // Only update if data is newer than session start
                    if (isRunning && dataTime > sessionStartTime) {
                        setTemperature(data.temperature);
                        setHistory(prev => {
                            const newPoint = {
                                temperature: data.temperature,
                                timestamp: data.lastUpdate,
                                time: new Date(data.lastUpdate).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
                            };
                            const lastPoint = prev[prev.length - 1];
                            if (lastPoint && lastPoint.timestamp === newPoint.timestamp) return prev;

                            return [...prev, newPoint];
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const interval = setInterval(fetchLatest, 5000);
        return () => clearInterval(interval);
    }, [isRunning, sessionStartTime]);

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const handleStartSession = () => {
        if (!socketPosition) {
            setError("Please select a socket position first.");
            return;
        }
        setError("");
        setTime(0);
        setHistory([]);
        setSessionStartTime(Date.now());
        setTemperature(null);
        setStartTemp(null);
        setIsRunning(true);
    };

    const handleEndSession = async () => {
        setIsRunning(false);
        if (temperature !== null && startTemp !== null) {
            try {
                await fetch('/api/sessions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        socket_position: socketPosition,
                        duration: time,
                        start_temp: startTemp,
                        end_temp: temperature
                    })
                });
            } catch (e) {
                console.error("Failed to save session", e);
            }
        }
    };

    const handlePredict = async () => {
        setPredictionError("");
        setPredictionResult(null);
        setIsPredicting(true);

        try {
            let inputs = { ...predictionInputs };

            // Auto-calculate if session is running and we have enough data
            if (isRunning && startTemp !== null && temperature !== null && time > 0) {
                // Estimate or find actual time to 50C
                let timeTo50 = 0;
                const hit50 = history.find(p => p.temperature >= 50);

                if (hit50) {
                    const pointTime = new Date(hit50.timestamp).getTime();
                    timeTo50 = (pointTime - sessionStartTime) / 1000;
                } else {
                    // Extrapolate using current rate just for timeTo50 estimation locally
                    const currentRate = (temperature - startTemp) / time;
                    if (currentRate > 0.001) {
                        timeTo50 = (50 - startTemp) / currentRate;
                    } else {
                        timeTo50 = 300;
                    }
                }

                inputs = {
                    initial_temp_C: startTemp.toFixed(2),
                    time_to_50C_sec: timeTo50.toFixed(2)
                };

                // Update UI to reflect calculated values
                setPredictionInputs(inputs);
            }

            const res = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    initial_temp_C: parseFloat(inputs.initial_temp_C),
                    time_to_50C_sec: parseFloat(inputs.time_to_50C_sec)
                })
            });

            const data = await res.json();
            if (res.ok) {
                setPredictionResult(data);
            } else {
                setPredictionError(data.error || "Prediction failed");
            }
        } catch (e) {
            setPredictionError("Failed to connect to prediction service");
            console.error(e);
        } finally {
            setIsPredicting(false);
        }
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1">
                        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-white/10 px-4 md:px-10 py-4 transition-colors duration-300">

                            <div className="hidden md:flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                <p className="text-sm font-medium text-green-300">LIVE</p>
                            </div>
                            <div className="flex flex-1 justify-end items-center gap-4">
                                <Link href="/dashboard/history">
                                    <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 transition-colors">
                                        <span className="material-symbols-outlined text-gray-900 dark:text-white text-xl">
                                            history
                                        </span>
                                        <span className="truncate">View History</span>
                                    </button>
                                </Link>
                                <Link href="/dashboard/settings">
                                    <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 transition-colors">
                                        <span className="material-symbols-outlined text-gray-900 dark:text-white text-xl">
                                            settings
                                        </span>
                                    </button>
                                </Link>
                                <Link href="/">
                                    <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 transition-colors">
                                        <span className="material-symbols-outlined text-gray-900 dark:text-white text-xl">
                                            logout
                                        </span>
                                    </button>
                                </Link>
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                                    data-alt="User avatar image with abstract colorful gradient"
                                    style={{
                                        backgroundImage:
                                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBw_vOzVcuAMKwJG_-0ryfVf5Y3hrE51tKnkGWix_5efqpMqRIhEJkUC_xAPsE0OzQTh92v-DcH60809i-OzBsgM0VR0AReRnunaZDNIxfcKQIZ_GjV36SP9zsR1sHMND5an9Dl2faP79MtxLgjzh_tq86gZ-dfNR66sRdi0Mx6AeytsTWegb7mrYKOKjm7qI5INesj95_yTtdkeWwM7QPNG-dEp-iXylGNUs2o4VZ9BlSDFqVvy-nCNs0sTvFftdcyJLegEe7Ma4kc")',
                                    }}
                                ></div>
                            </div>
                        </header>
                        <main className="flex-grow p-4 md:p-6 lg:p-10">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 transition-colors">
                                Live Analysis Dashboard
                            </h1>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 grid grid-cols-1 gap-6">
                                    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 dark:border-white/10 p-6 bg-white dark:bg-white/5 shadow-sm dark:shadow-none transition-all">
                                        <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">
                                            Live Temperature Analysis
                                        </p>
                                        <p className="text-gray-900 dark:text-white tracking-light text-4xl font-bold leading-tight truncate">
                                            {temperature !== null ? `${temperature} °C` : "-- °C"}
                                        </p>
                                        <div className="flex gap-2 items-center">
                                            <p className="text-gray-500 dark:text-white/60 text-sm font-normal leading-normal transition-colors">
                                                Real-time update
                                            </p>
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-green-400 text-base">
                                                    arrow_upward
                                                </span>
                                                <p className="text-green-400 text-sm font-medium leading-normal">
                                                    +0.2%
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex min-h-[400px] flex-1 flex-col gap-8 py-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={history}>
                                                    <defs>
                                                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#06bedb" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#06bedb" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis
                                                        dataKey="time"
                                                        hide={true}
                                                    />
                                                    <YAxis
                                                        domain={['auto', 'auto']}
                                                        tick={{ fill: '#888888', fontSize: 12 }}
                                                        width={40}
                                                        tickFormatter={(value) => `${value}`}
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
                                                        fill="url(#colorTemp)"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                            <div className="flex justify-between text-gray-400 dark:text-white/40 text-[13px] font-bold leading-normal tracking-[0.015em] transition-colors">
                                                <p>10s ago</p>
                                                <p>8s ago</p>
                                                <p>6s ago</p>
                                                <p>4s ago</p>
                                                <p>2s ago</p>
                                                <p className="text-gray-600 dark:text-white/60">Now</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-white/10 p-6 bg-white dark:bg-white/5 shadow-sm dark:shadow-none transition-all">
                                    <h3 className="text-gray-900 dark:text-white text-lg font-bold transition-colors">
                                        Device Specifications
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-1 rounded-lg p-4 bg-gray-100 dark:bg-black/20 transition-colors">
                                            <p className="text-gray-500 dark:text-white/60 text-sm font-medium leading-normal transition-colors">
                                                Socket Position
                                            </p>
                                            <select
                                                value={socketPosition}
                                                onChange={(e) => {
                                                    setSocketPosition(e.target.value);
                                                    if (e.target.value) setError("");
                                                }}
                                                disabled={isRunning}
                                                className={`bg-transparent text-gray-900 dark:text-white text-xl font-bold leading-tight border-none p-0 focus:ring-0 cursor-pointer [&>option]:text-background-dark transition-colors ${error ? "border-red-500 border-b-2" : ""}`}
                                            >
                                                <option value="">Select Position</option>
                                                <option value="Below Knee">Below Knee</option>
                                                <option value="Above Knee">Above Knee</option>
                                                <option value="Above Elbow">Above Elbow</option>
                                                <option value="Below Elbow">Below Elbow</option>
                                            </select>
                                            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                                        </div>
                                        <div className="flex flex-col gap-1 rounded-lg p-4 bg-gray-100 dark:bg-black/20 transition-colors">
                                            <p className="text-gray-500 dark:text-white/60 text-sm font-medium leading-normal transition-colors">
                                                Sheet Thickness
                                            </p>
                                            <p className="text-gray-900 dark:text-white tracking-light text-xl font-bold leading-tight transition-colors">
                                                4mm
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-1 rounded-lg p-4 bg-gray-100 dark:bg-black/20 transition-colors">
                                            <p className="text-gray-500 dark:text-white/60 text-sm font-medium leading-normal transition-colors">
                                                Device ID
                                            </p>
                                            <p className="text-gray-900 dark:text-white tracking-light text-xl font-bold leading-tight transition-colors">
                                                BF3D-7B34C
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-white/10 p-6 bg-white dark:bg-white/5 shadow-sm dark:shadow-none transition-all">
                                    <h3 className="text-gray-900 dark:text-white text-lg font-bold transition-colors">
                                        Session Control
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-1 rounded-lg p-4 bg-gray-100 dark:bg-black/20 transition-colors">
                                            <p className="text-gray-500 dark:text-white/60 text-sm font-medium leading-normal transition-colors">
                                                Session Duration
                                            </p>
                                            <p className="text-gray-900 dark:text-white tracking-light text-xl font-bold leading-tight transition-colors">
                                                {formatTime(time)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleEndSession}
                                            disabled={!isRunning}
                                            className={`flex w-full min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-lg h-12 px-4 text-background-dark text-base font-bold leading-normal tracking-[0.015em] transition-colors ${!isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary cursor-pointer hover:bg-primary/90'}`}
                                        >
                                            <span className="truncate">End Session</span>
                                        </button>
                                        <button
                                            onClick={handleStartSession}
                                            disabled={isRunning}
                                            className={`flex w-full min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-lg h-12 px-4 transition-colors ${isRunning ? 'bg-gray-700/50 text-white/30 cursor-not-allowed' : 'bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white cursor-pointer hover:bg-gray-300 dark:hover:bg-white/20'}`}
                                        >
                                            <span className="truncate">Start New Session</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* AI Prediction Section */}
                            <div className="mt-6 flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-white/10 p-6 bg-white dark:bg-white/5 shadow-sm dark:shadow-none transition-all">
                                <h3 className="text-gray-900 dark:text-white text-lg font-bold transition-colors">
                                    AI Process Optimizer
                                </h3>
                                <p className="text-gray-500 dark:text-white/60 text-sm mb-4">
                                    Input process parameters to get AI-driven recommendations for optimal temperature and dwell time.
                                    {isRunning && <span className="ml-2 text-green-500 font-bold text-xs uppercase tracking-wider bg-green-500/10 px-2 py-1 rounded">Auto-Calculating from Live Data</span>}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 dark:text-white/60">Initial Temp (°C)</label>
                                        <input
                                            type="number"
                                            value={predictionInputs.initial_temp_C}
                                            onChange={(e) => setPredictionInputs(prev => ({ ...prev, initial_temp_C: e.target.value }))}
                                            className={`rounded-lg border bg-gray-100 dark:bg-black/20 p-3 text-gray-900 dark:text-white font-bold ${parseFloat(predictionInputs.initial_temp_C) > 50 || parseFloat(predictionInputs.initial_temp_C) < 10
                                                    ? "border-yellow-500/50"
                                                    : "border-transparent"
                                                }`}
                                            placeholder="e.g. 24.5"
                                        />
                                        {(parseFloat(predictionInputs.initial_temp_C) > 50 || parseFloat(predictionInputs.initial_temp_C) < 10) && (
                                            <p className="text-[10px] text-yellow-500">Optimal range: 10-40°C</p>
                                        )}
                                    </div>
                                    {/* Heating Rate is now auto-calculated in backend */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 dark:text-white/60">Time to 50°C (s)</label>
                                        <input
                                            type="number"
                                            value={predictionInputs.time_to_50C_sec}
                                            onChange={(e) => setPredictionInputs(prev => ({ ...prev, time_to_50C_sec: e.target.value }))}
                                            className={`rounded-lg border bg-gray-100 dark:bg-black/20 p-3 text-gray-900 dark:text-white font-bold ${parseFloat(predictionInputs.time_to_50C_sec) < 60 || parseFloat(predictionInputs.time_to_50C_sec) > 900
                                                    ? "border-yellow-500/50"
                                                    : "border-transparent"
                                                }`}
                                            placeholder="e.g. 205"
                                        />
                                        {(parseFloat(predictionInputs.time_to_50C_sec) < 60 || parseFloat(predictionInputs.time_to_50C_sec) > 900) && (
                                            <p className="text-[10px] text-yellow-500">Optimal range: 60-900s</p>
                                        )}
                                    </div>
                                </div>

                                {isRunning && predictionInputs.initial_temp_C && (
                                    <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex flex-col gap-1">
                                        <div className="font-bold uppercase tracking-wider mb-1">Live Auto-Calculation</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="opacity-70">Current Rate:</span>
                                                <span className="font-mono ml-2 font-bold text-white">
                                                    {((parseFloat(predictionInputs.initial_temp_C) > 0 && predictionInputs.time_to_50C_sec)
                                                        ? (Math.max(0.01, (50 - parseFloat(predictionInputs.initial_temp_C)) / parseFloat(predictionInputs.time_to_50C_sec))).toFixed(4)
                                                        : "Calculating...")} °C/s
                                                </span>
                                            </div>
                                            <div>
                                                <span className="opacity-70">Est. Time to 50°C:</span>
                                                <span className="font-mono ml-2 font-bold text-white">{predictionInputs.time_to_50C_sec} s</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handlePredict}
                                    disabled={isPredicting}
                                    className="w-full md:w-auto self-start px-6 h-10 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isPredicting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-lg">psychology</span>
                                            Get AI Suggestion
                                        </>
                                    )}
                                </button>

                                {predictionError && (
                                    <div className="p-4 rounded-lg bg-red-500/10 text-red-500 text-sm mt-2">
                                        Error: {predictionError}
                                    </div>
                                )}

                                {predictionResult && (
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col gap-1">
                                            <p className="text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">Recommended Temp</p>
                                            <p className="text-2xl font-black text-purple-700 dark:text-purple-200">
                                                {predictionResult.recommended_temp.toFixed(1)} °C
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col gap-1">
                                            <p className="text-blue-600 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">Recommended Dwell Time</p>
                                            <p className="text-2xl font-black text-blue-700 dark:text-blue-200">
                                                {predictionResult.recommended_dwell.toFixed(0)} s
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
            />
        </div>
    );
}
