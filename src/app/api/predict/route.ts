import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const exam = searchParams.get("exam");
  const rankStr = searchParams.get("rank");

  if (!exam || !rankStr) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const rank = parseInt(rankStr);
  if (isNaN(rank)) {
    return NextResponse.json({ error: "Invalid rank" }, { status: 400 });
  }

  try {
    let colleges;

    // Score-based exams: higher score = better → cutoffRank <= user's score
    // Rank-based exams: lower rank = better → cutoffRank >= user's rank
    const scoreBasedExams = ["BITSAT", "CUET", "NEET", "CAT"];

    if (scoreBasedExams.includes(exam)) {
      colleges = await prisma.college.findMany({
        where: {
          cutoffExam: exam,
          cutoffRank: { lte: rank },
        },
        orderBy: { rating: 'desc' },
        take: 20,
      });
    } else {
      // Rank-based: JEE Main, JEE Advanced, VITEEE, CLAT
      colleges = await prisma.college.findMany({
        where: {
          cutoffExam: exam,
          cutoffRank: { gte: rank },
        },
        orderBy: { rating: 'desc' },
        take: 20,
      });
    }

    return NextResponse.json(colleges);
  } catch (error) {
    console.error("Predict API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
