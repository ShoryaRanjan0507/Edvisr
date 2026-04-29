import { prisma } from "@/lib/prisma";
import CollegeCard from "@/components/CollegeCard";
import SearchAndFilter from "@/components/SearchAndFilter";
import Link from "next/link";
import Logo from "@/components/Logo";
import CinematicIntro from "@/components/CinematicIntro";

export default async function Home(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams?.q === "string" ? searchParams.q : undefined;
  const location = typeof searchParams?.location === "string" ? searchParams.location : undefined;
  const maxFees = typeof searchParams?.maxFees === "string" ? parseInt(searchParams.maxFees) : undefined;

  const where: any = {};
  if (query) where.name = { contains: query };
  if (location) where.location = location;
  if (maxFees !== undefined) where.averageFees = { lte: maxFees };

  const locationsData = await prisma.college.findMany({
    select: { location: true },
    distinct: ['location'],
  });
  const locations = locationsData.map((c) => c.location);

  const colleges = await prisma.college.findMany({
    where,
    orderBy: { rating: 'desc' }
  });

  const featuredNames = ["IIT Bombay", "IIT Delhi", "IIT Madras", "IIM Ahmedabad", "IISc Bangalore", "BITS Pilani"];
  const featuredColleges = await prisma.college.findMany({
    where: { OR: featuredNames.map(n => ({ name: { contains: n } })) },
    take: 6,
    orderBy: { rating: 'desc' }
  });

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <CinematicIntro />
      
      {/* Cinematic Full-screen Hero */}
      <section className="relative h-screen w-full flex flex-col justify-center items-start px-8 md:px-20 overflow-hidden bg-black">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b7/IITBMainBuidling.jpg"
            className="w-full h-full object-cover opacity-50 grayscale-[20%] scale-105 animate-in fade-in duration-1000"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-[2500ms]">
            EST. 2024 — NEW DELHI & MUMBAI
          </p>
          <h1 className="text-5xl md:text-[100px] font-thin text-white leading-[0.9] tracking-[-0.04em] mb-12 animate-in fade-in zoom-in-95 slide-in-from-bottom-12 duration-1000 delay-[2700ms]">
            Education that shapes <br />
            <span className="text-white/40 italic font-serif">how you experience</span> <br />
            the world.
          </h1>
          <div className="flex items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-[3200ms]">
            <a href="#explore" className="group flex items-center gap-4 text-white text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="w-12 h-px bg-white/20 group-hover:w-20 transition-all duration-500"></span>
              Scroll to Explore
            </a>
          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-[3500ms]">
          <div className="w-px h-16 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* Discovery Section */}
      <div id="explore" className="max-w-7xl mx-auto px-8 md:px-20 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Curated Excellence</p>
            <h2 className="text-4xl md:text-6xl font-thin tracking-tighter text-gray-900 leading-tight">
              A selection of India's <br /> finest academic spaces.
            </h2>
          </div>
          <div className="text-gray-400 text-sm max-w-xs font-medium leading-relaxed">
            Our platform bridges the gap between ambition and reality, providing high-fidelity data for 1,200+ institutions.
          </div>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-gray-100 border border-gray-100 mb-32 overflow-hidden rounded-[32px] shadow-2xl shadow-gray-200/50">
          {featuredColleges.map((college) => (
            <Link key={college.id} href={`/colleges/${college.id}`} className="group relative bg-white aspect-[4/5] overflow-hidden transition-all duration-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={college.imageUrl || ""}
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                alt={college.name}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{college.location.split(',')[0]}</p>
                <h3 className="text-2xl font-thin text-white tracking-tight">{college.name}</h3>
              </div>
              <div className="absolute top-8 right-8 text-white/40 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Search & Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <aside className="lg:col-span-3">
            <div className="sticky top-20">
              <SearchAndFilter locations={locations} />
            </div>
          </aside>
          
          <main className="lg:col-span-9">
            <div className="mb-12 flex justify-between items-center border-b border-gray-100 pb-8">
              <h3 className="text-2xl font-thin tracking-tight text-gray-900">Institutional Archive</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{colleges.length} Entries Found</p>
            </div>

            <div className="space-y-6">
              {colleges.length > 0 ? (
                colleges.map((college) => <CollegeCard key={college.id} college={college} />)
              ) : (
                <div className="py-20 text-center opacity-40">
                  <p className="text-[10px] font-black uppercase tracking-widest">No matching entries in archive</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Footer Minimalist */}
      <footer className="bg-white border-t border-gray-100 py-20 px-8 md:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4 text-gray-900 font-black text-xl tracking-tighter uppercase">
            <Logo className="w-8 h-8" />
            Edvisr.
          </div>
          <div className="flex gap-12">
            <Link href="/" className="text-gray-400 hover:text-gray-900 text-[10px] font-black uppercase tracking-[0.3em] transition-all">Privacy</Link>
            <Link href="/" className="text-gray-400 hover:text-gray-900 text-[10px] font-black uppercase tracking-[0.3em] transition-all">Terms</Link>
            <Link href="/" className="text-gray-400 hover:text-gray-900 text-[10px] font-black uppercase tracking-[0.3em] transition-all">Contact</Link>
          </div>
          <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
            © 2024 EDVISR INDIA
          </div>
        </div>
      </footer>
    </div>
  );
}
