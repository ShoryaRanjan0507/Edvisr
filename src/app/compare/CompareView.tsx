"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { College } from "@prisma/client";

type CollegeWithCourses = College & { courses: any[] };
type BasicCollegeInfo = { id: string; name: string; location: string };

export default function CompareView({
  allColleges,
  initialSelected,
}: {
  allColleges: BasicCollegeInfo[];
  initialSelected: CollegeWithCourses[];
}) {
  const router = useRouter();
  const [selectedColleges, setSelectedColleges] = useState<CollegeWithCourses[]>(initialSelected);
  const [isPending, setIsPending] = useState(false);
  const [searchTerm, setSearchTerm] = useState<{ [key: number]: string }>({ 0: "", 1: "", 2: "" });
  const [isDropdownOpen, setIsDropdownOpen] = useState<{ [key: number]: boolean }>({ 0: false, 1: false, 2: false });

  // Sync state with props when navigation occurs
  useEffect(() => {
    setSelectedColleges(initialSelected);
    setIsPending(false);
  }, [initialSelected]);

  const updateURL = (colleges: CollegeWithCourses[]) => {
    const params = new URLSearchParams();
    colleges.forEach((c, index) => {
      params.set(`c${index + 1}`, c.id);
    });
    router.replace(`/compare?${params.toString()}`);
  };

  const handleRemove = (id: string) => {
    const newSelected = selectedColleges.filter(c => c.id !== id);
    setSelectedColleges(newSelected);
    updateURL(newSelected);
  };

  const handleAdd = async (id: string, index: number) => {
    if (selectedColleges.length >= 3) return;
    if (selectedColleges.find(c => c.id === id)) return;
    
    setIsPending(true);
    setIsDropdownOpen({ ...isDropdownOpen, [index]: false });
    setSearchTerm({ ...searchTerm, [index]: "" });

    const currentIds = selectedColleges.map(c => c.id);
    const params = new URLSearchParams();
    [...currentIds, id].forEach((cid, index) => {
      params.set(`c${index + 1}`, cid);
    });
    router.push(`/compare?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      {/* Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((index) => {
          const college = selectedColleges[index];
          const filteredColleges = allColleges
            .filter(c => !selectedColleges.find(sc => sc.id === c.id))
            .filter(c => c.name.toLowerCase().includes((searchTerm[index] || "").toLowerCase()))
            .slice(0, 100);

          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-full relative z-[50]" style={{ zIndex: 30 - index }}>
              {college ? (
                <>
                  <button 
                    onClick={() => handleRemove(college.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors z-10"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-100 mb-4">
                    <Image 
                      src={college.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800"} 
                      alt={college.name} 
                      fill 
                      className="object-cover" 
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{college.name}</h3>
                  <p className="text-gray-500 text-sm">{college.location}</p>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50 min-h-[250px] relative">
                  <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                    {isPending ? (
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </div>
                  <p className="text-gray-600 font-medium mb-4">{isPending ? "Adding college..." : "Add a college"}</p>
                  
                  <div className="w-full space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Search colleges..."
                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-gray-400"
                        value={searchTerm[index] || ""}
                        onChange={(e) => setSearchTerm({ ...searchTerm, [index]: e.target.value })}
                      />
                    </div>

                    {/* Scrollable List (Replaced native select for better styling and filtering) */}
                    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                      <div className="max-h-40 overflow-y-auto custom-scrollbar">
                        {filteredColleges.length > 0 ? (
                          filteredColleges.map(c => (
                            <button
                              key={c.id}
                              className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 flex flex-col"
                              onClick={() => handleAdd(c.id, index)}
                            >
                              <span className="font-semibold truncate">{c.name}</span>
                              <span className="text-[10px] text-gray-500 truncate">{c.location}</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-4 text-sm text-gray-400 italic text-center">No colleges match your search</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      {selectedColleges.length > 0 && (
        <div className="bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900">
                  <th className="p-6 font-bold text-gray-400 uppercase tracking-widest text-[10px] w-1/4">Key Metrics</th>
                  {selectedColleges.map(c => (
                    <th key={c.id} className="p-6 font-black text-white text-lg w-1/4">
                      <Link href={`/colleges/${c.id}`} className="hover:text-blue-400 transition-colors">
                        {c.name}
                      </Link>
                    </th>
                  ))}
                  {[...Array(3 - selectedColleges.length)].map((_, i) => (
                    <th key={`empty-${i}`} className="p-6 w-1/4"></th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px] bg-gray-50/50">Admission Rating</td>
                  {selectedColleges.map(c => (
                    <td key={c.id} className="p-6">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-100 text-amber-700 text-sm font-black px-3 py-1 rounded-xl border border-amber-200">
                          {c.rating.toFixed(1)} / 5.0
                        </span>
                      </div>
                    </td>
                  ))}
                  {[...Array(3 - selectedColleges.length)].map((_, i) => <td key={`empty-${i}`} className="p-6"></td>)}
                </tr>
                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px] bg-gray-50/50">Tuition (Annual)</td>
                  {selectedColleges.map(c => (
                    <td key={c.id} className="p-6">
                      <p className="text-xl font-black text-gray-900">₹{(c.averageFees / 100000).toFixed(1)} <span className="text-sm font-bold text-gray-400 uppercase">Lakhs</span></p>
                    </td>
                  ))}
                  {[...Array(3 - selectedColleges.length)].map((_, i) => <td key={`empty-${i}`} className="p-6"></td>)}
                </tr>
                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px] bg-gray-50/50">Avg Salary Package</td>
                  {selectedColleges.map(c => (
                    <td key={c.id} className="p-6">
                      <p className="text-xl font-black text-blue-600">{c.averagePackage} <span className="text-sm font-bold text-blue-300 uppercase">LPA</span></p>
                    </td>
                  ))}
                  {[...Array(3 - selectedColleges.length)].map((_, i) => <td key={`empty-${i}`} className="p-6"></td>)}
                </tr>
                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px] bg-gray-50/50">Placement Success</td>
                  {selectedColleges.map(c => (
                    <td key={c.id} className="p-6">
                      <p className="text-xl font-black text-emerald-500">{c.placement}<span className="text-sm font-bold text-emerald-300 uppercase">%</span></p>
                    </td>
                  ))}
                  {[...Array(3 - selectedColleges.length)].map((_, i) => <td key={`empty-${i}`} className="p-6"></td>)}
                </tr>
                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px] bg-gray-50/50">Campus Location</td>
                  {selectedColleges.map(c => (
                    <td key={c.id} className="p-6 text-gray-600 font-bold">
                      {c.location}
                    </td>
                  ))}
                  {[...Array(3 - selectedColleges.length)].map((_, i) => <td key={`empty-${i}`} className="p-6"></td>)}
                </tr>
                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-6 font-bold text-gray-500 uppercase tracking-widest text-[10px] bg-gray-50/50 align-top">Flagship Programs</td>
                  {selectedColleges.map(c => (
                    <td key={c.id} className="p-6 align-top">
                      <div className="flex flex-wrap gap-2">
                        {c.courses.slice(0, 3).map(course => (
                          <span key={course.id} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-black uppercase tracking-tight border border-gray-200 line-clamp-1">
                            {course.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                  {[...Array(3 - selectedColleges.length)].map((_, i) => <td key={`empty-${i}`} className="p-6"></td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
