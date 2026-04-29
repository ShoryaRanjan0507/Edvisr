import { prisma } from "@/lib/prisma";
import CompareView from "./CompareView";

export default async function ComparePage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const c1 = typeof searchParams?.c1 === "string" ? searchParams.c1 : undefined;
  const c2 = typeof searchParams?.c2 === "string" ? searchParams.c2 : undefined;
  const c3 = typeof searchParams?.c3 === "string" ? searchParams.c3 : undefined;

  const idsToCompare = [c1, c2, c3].filter(Boolean) as string[];

  // Fetch selected colleges
  const selectedColleges = idsToCompare.length > 0
    ? await prisma.college.findMany({
        where: { id: { in: idsToCompare } },
        include: { courses: true },
      })
    : [];

  // Fetch all colleges for the dropdown
  const allColleges = await prisma.college.findMany({
    select: { id: true, name: true, location: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Compare Colleges</h1>
          <p className="text-gray-600 mt-2">
            Select up to 3 colleges to compare their fees, placements, and ratings side-by-side.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CompareView 
          allColleges={allColleges} 
          initialSelected={selectedColleges} 
        />
      </div>
    </div>
  );
}
