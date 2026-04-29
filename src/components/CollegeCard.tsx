"use client";

import Link from "next/link";
import { College } from "@prisma/client";
import { useState } from "react";

export default function CollegeCard({ college }: { college: College }) {
  const [imgError, setImgError] = useState(false);
  const fallback = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800";
  const src = imgError ? fallback : (college.imageUrl || fallback);

  return (
    <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 transition-all duration-700 group flex flex-col sm:flex-row h-auto sm:h-64 hover:border-gray-300">
      <div className="relative w-full sm:w-[35%] h-56 sm:h-full bg-gray-50 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={college.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out grayscale-[20%] group-hover:grayscale-0"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        <div className="absolute top-6 left-6 bg-white/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-gray-900 flex items-center gap-1.5 border border-white/20 uppercase tracking-widest">
          {college.rating.toFixed(1)} / 5.0
        </div>
      </div>
      
      <div className="p-10 flex flex-col flex-1 relative">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                Tier-1 Institutional Entry
              </span>
            </div>
            <Link href={`/colleges/${college.id}`} className="block">
              <h2 className="text-3xl font-thin text-gray-900 line-clamp-1 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                {college.name}
              </h2>
            </Link>
            <div className="flex items-center text-gray-400 text-[10px] mt-3 gap-2 font-black uppercase tracking-widest">
              <svg className="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {college.location}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12 mt-auto pt-8 border-t border-gray-50">
          <div className="space-y-1.5">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">Est. Fees</p>
            <p className="text-gray-900 font-black text-xl tracking-tighter">₹{(college.averageFees / 100000).toFixed(1)}L</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">Package</p>
            <p className="text-blue-600 font-black text-xl tracking-tighter">{college.averagePackage} LPA</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">Placement</p>
            <p className="text-emerald-500 font-black text-xl tracking-tighter">{college.placement}%</p>
          </div>
          
          <Link 
            href={`/colleges/${college.id}`}
            className="ml-auto flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
