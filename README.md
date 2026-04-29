# Edvisr

A modern, premium college discovery and prediction platform built for Indian students.

## Features

- **College Predictor**: Input your exam (JEE Main, Advanced, NEET, CAT, BITSAT, VITEEE, etc.) and rank/score to get AI-driven predictions on your college chances based on NIRF rankings and historical cutoffs.
- **Advanced Filtering**: Browse over 1,200 colleges using filters for location, fees, placement rates, exams, and more.
- **Compare Colleges**: Side-by-side comparison of multiple institutions to help you make the best decision for your future.
- **Premium UI**: Designed with a sleek, cinematic, glassmorphic UI using Tailwind CSS and Next.js App Router for blazing-fast performance.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (hosted on NeonDB)
- **ORM**: Prisma
- **Styling**: Tailwind CSS & Vanilla CSS for custom animations
- **Language**: TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Setup your `.env` file with a `DATABASE_URL` pointing to your Postgres database
4. Push the schema: `npx prisma db push`
5. Seed the database: `npm run seed` or `npx tsx scripts/importColleges.ts`
6. Start the development server: `npm run dev`

Visit `http://localhost:3000` to view the app!
