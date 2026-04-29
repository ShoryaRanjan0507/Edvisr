"use client";

import { useState } from "react";
import CollegeCard from "@/components/CollegeCard";

export default function PredictorPage() {
  const [exam, setExam] = useState("JEE Main");
  const [rank, setRank] = useState("");
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults(null);
    
    try {
      const response = await fetch("/api/predict?exam=" + encodeURIComponent(exam) + "&rank=" + rank);
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      
      setResults(data);
    } catch (err) {
      console.error("Prediction failed", err);
      setError("Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getChance = (cutoff: number, userValue: number, isScore: boolean) => {
    if (isScore) {
      const diff = userValue - cutoff;
      if (diff > 50) return { label: "Exceptional", color: "text-emerald-600 border-emerald-100 bg-emerald-50" };
      if (diff > 20) return { label: "High", color: "text-blue-600 border-blue-100 bg-blue-50" };
      return { label: "Medium", color: "text-amber-600 border-amber-100 bg-amber-50" };
    } else {
      const ratio = userValue / cutoff;
      if (ratio < 0.5) return { label: "Exceptional Match", color: "text-emerald-600 border-emerald-100 bg-emerald-50" };
      if (ratio < 0.8) return { label: "High Probability", color: "text-blue-600 border-blue-100 bg-blue-50" };
      return { label: "Good Match", color: "text-amber-600 border-amber-100 bg-amber-50" };
    }
  };

  const isScoreBased = ["BITSAT", "NEET", "CUET", "CAT"].includes(exam);

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-32">
      {/* Minimal Hero */}
      <div className="bg-white border-b border-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-8 md:px-20">
          <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Strategic Forecasting</p>
          <h1 className="text-5xl md:text-7xl font-thin text-gray-900 tracking-tighter leading-none mb-8">
            Academic <span className="text-gray-300 italic font-serif">Probability</span> Index.
          </h1>
          <p className="text-gray-400 text-sm max-w-xl font-medium leading-relaxed">
            Utilizing verified historical cutoff data to benchmark your performance against 1,200+ institutions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 md:px-20 -mt-12">
        {/* Simplified Form */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-10 md:p-12 shadow-2xl shadow-gray-200/50">
          <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entrance Exam</label>
              <div className="relative">
                <select 
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border-b border-gray-200 py-4 text-gray-900 font-black text-xs uppercase tracking-widest focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
                >
                  <option value="JEE Main">JEE Main</option>
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="BITSAT">BITSAT</option>
                  <option value="VITEEE">VITEEE</option>
                  <option value="CAT">CAT</option>
                  <option value="NEET">NEET</option>
                  <option value="CLAT">CLAT</option>
                  <option value="CUET">CUET</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isScoreBased ? "Obtained Score" : "All India Rank"}</label>
              <input 
                type="number"
                placeholder={isScoreBased ? "350" : "12000"}
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                required
                className="w-full bg-gray-50 border-b border-gray-200 py-4 text-gray-900 font-black text-xs uppercase tracking-widest placeholder-gray-300 focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-gray-900 hover:bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.3em] py-5 px-8 rounded-2xl transition-all disabled:opacity-50"
            >
              {loading ? "Analyzing Matrix..." : "Execute Prediction"}
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="mt-24">
          {error && (
            <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-12">
              Error: {error}
            </div>
          )}

          {results && results.length > 0 ? (
            <div className="space-y-16">
              <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                <h2 className="text-2xl font-thin tracking-tight text-gray-900">Matches Found</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{results.length} Institutions</p>
              </div>
              
              <div className="grid grid-cols-1 gap-12">
                {results.map((college, idx) => {
                  const chance = getChance(college.cutoffRank, parseInt(rank), isScoreBased);
                  return (
                    <div 
                      key={college.id} 
                      className="relative animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className={`absolute top-0 right-0 z-10 px-4 py-2 rounded-full font-black text-[8px] uppercase tracking-widest border ${chance.color}`}>
                        {chance.label}
                      </div>
                      <CollegeCard college={college} />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : results && results.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Zero matches in current matrix</p>
            </div>
          ) : (
            <div className="py-32 text-center">
              <p className="text-[10px] font-black text-gray-200 uppercase tracking-[0.4em]">Awaiting Input Parameter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
