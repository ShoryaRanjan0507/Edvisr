import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookmarkCollegeButton from "@/components/BookmarkCollegeButton";

export default async function CollegeDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const college = await prisma.college.findUnique({
    where: { id: params.id },
    include: { courses: true },
  });

  if (!college) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Cinematic Hero */}
      <div className="relative h-[400px] bg-gray-900 overflow-hidden">
        {college.imageUrl && (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={college.imageUrl} 
              alt={college.name} 
              className="w-full h-full object-cover opacity-40 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-transparent to-black/60"></div>
          </div>
        )}
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <Link href="/" className="absolute top-32 left-4 md:left-8 inline-flex items-center text-xs font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 z-20">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Explorer
          </Link>
          
          <div className="absolute top-32 right-4 md:right-8 z-20">
            <BookmarkCollegeButton collegeId={college.id} />
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">
                  Verified Tier-1
                </span>
                <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-white/10">
                  {college.location}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
                {college.name}
              </h1>
            </div>
            
            <div className="hidden md:flex gap-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] text-center min-w-[140px]">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Rating</p>
                <p className="text-2xl font-black text-white">{college.rating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-blue-900/5 border border-white group hover:scale-[1.02] transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Fees</p>
                <p className="text-2xl font-black text-gray-900">₹{(college.averageFees / 100000).toFixed(1)} <span className="text-sm font-bold text-gray-400 uppercase tracking-tight">Lakhs</span></p>
              </div>
              <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-blue-900/5 border border-white group hover:scale-[1.02] transition-all">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 text-emerald-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Package</p>
                <p className="text-2xl font-black text-gray-900">{college.averagePackage} <span className="text-sm font-bold text-gray-400 uppercase tracking-tight">LPA</span></p>
              </div>
              <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-blue-900/5 border border-white group hover:scale-[1.02] transition-all">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 text-purple-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Placement</p>
                <p className="text-2xl font-black text-gray-900">{college.placement}<span className="text-sm font-bold text-gray-400 uppercase tracking-tight">%</span></p>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-[40px] shadow-xl shadow-blue-900/5 border border-white p-10 md:p-14 space-y-12">
              <section>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-6">Institutional Overview</h2>
                <p className="text-gray-500 text-lg leading-relaxed font-medium">
                  {college.description}
                </p>
              </section>

              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Academics</h2>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full uppercase tracking-widest">
                    {college.courses.length} Programs Available
                  </span>
                </div>
                <div className="overflow-hidden rounded-[24px] border border-gray-100">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Program Name</th>
                        <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration</th>
                        <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Fees</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {college.courses.map((course) => (
                        <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-5 text-sm font-black text-gray-900">{course.name}</td>
                          <td className="p-5 text-sm font-bold text-gray-400">{course.duration}</td>
                          <td className="p-5 text-sm font-black text-blue-600">₹{course.fees.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-gray-900 rounded-[40px] p-10 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/40 transition-colors"></div>
              <h3 className="text-2xl font-black mb-4 relative z-10">Strategic Comparison</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed relative z-10">
                Data-driven benchmarks to help you evaluate ROI and admission probability.
              </p>
              <Link 
                href={`/compare?c1=${college.id}`}
                className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/40 uppercase tracking-widest text-xs relative z-10 active:scale-95"
              >
                Start Comparison
              </Link>
            </div>

            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-blue-900/5">
              <h3 className="text-xl font-black text-gray-900 mb-6">Top Recruiters</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Microsoft', 'Google', 'Amazon', 'TCS', 'Infosys', 'Deloitte', 'Apple', 'Meta'].map(company => (
                  <div key={company} className="px-4 py-3 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 flex items-center justify-center hover:text-blue-600 hover:border-blue-100 transition-all cursor-default">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
