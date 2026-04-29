"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function SearchAndFilter({ locations }: { locations: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("q") || "";
  const currentLocation = searchParams.get("location") || "";
  const currentMaxFees = searchParams.get("maxFees") || "";

  const [search, setSearch] = useState(currentSearch);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1"); // Reset pagination
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6 sticky top-6">
      <div>
        <h3 className="font-semibold text-lg text-gray-900 mb-3">Search</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search colleges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParams("q", search);
              }
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button 
          onClick={() => updateParams("q", search)}
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Search
        </button>
      </div>

      <div className="h-px bg-gray-100" />

      <div>
        <h3 className="font-semibold text-lg text-gray-900 mb-3">Filters</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              value={currentLocation}
              onChange={(e) => updateParams("location", e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Fees (₹)</label>
            <input
              type="range"
              min="0"
              max="1000000"
              step="50000"
              value={currentMaxFees || "1000000"}
              onChange={(e) => updateParams("maxFees", e.target.value)}
              className="w-full accent-blue-600"
            />
            <div className="text-sm text-gray-500 mt-1 flex justify-between">
              <span>₹0</span>
              <span>{currentMaxFees ? `₹${Number(currentMaxFees).toLocaleString()}` : 'Any'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {(currentSearch || currentLocation || currentMaxFees) && (
        <button
          onClick={() => {
            setSearch("");
            router.push("/");
          }}
          className="text-sm text-red-600 font-medium hover:text-red-700 mt-2"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
