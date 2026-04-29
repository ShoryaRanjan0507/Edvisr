import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.course.deleteMany()
  await prisma.college.deleteMany()

  // Create Colleges
  const c1 = await prisma.college.create({
    data: {
      name: 'Indian Institute of Technology (IIT) Delhi',
      location: 'New Delhi, Delhi NCR',
      rating: 4.8,
      averageFees: 220000,
      placement: 98.5,
      description: 'IIT Delhi is one of the premier engineering institutes in India, known for its excellent faculty, research facilities, and high placement rates.',
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      cutoffExam: 'JEE Advanced',
      cutoffRank: 5000,
      courses: {
        create: [
          { name: 'B.Tech in Computer Science', duration: '4 Years', fees: 225000 },
          { name: 'B.Tech in Electrical Engineering', duration: '4 Years', fees: 220000 },
          { name: 'M.Tech in Data Science', duration: '2 Years', fees: 150000 },
        ]
      }
    }
  })

  const c2 = await prisma.college.create({
    data: {
      name: 'Birla Institute of Technology and Science (BITS)',
      location: 'Pilani, Rajasthan',
      rating: 4.6,
      averageFees: 550000,
      placement: 95.0,
      description: 'BITS Pilani is a highly reputed private institute recognized for its flexible curriculum and strong entrepreneurial culture.',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      cutoffExam: 'BITSAT',
      cutoffRank: 320, // Using score for bitsat as example
      courses: {
        create: [
          { name: 'B.E. in Computer Science', duration: '4 Years', fees: 550000 },
          { name: 'B.E. in Mechanical Engineering', duration: '4 Years', fees: 540000 },
        ]
      }
    }
  })

  const c3 = await prisma.college.create({
    data: {
      name: 'National Institute of Technology (NIT) Trichy',
      location: 'Tiruchirappalli, Tamil Nadu',
      rating: 4.5,
      averageFees: 150000,
      placement: 92.0,
      description: 'NIT Trichy is ranked among the top NITs in India, offering excellent academic programs and consistent placement records.',
      imageUrl: 'https://images.unsplash.com/photo-1498243639359-2cee3dc1064a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Swapped broken image
      cutoffExam: 'JEE Main',
      cutoffRank: 15000,
      courses: {
        create: [
          { name: 'B.Tech in Electronics', duration: '4 Years', fees: 150000 },
          { name: 'B.Tech in Civil Engineering', duration: '4 Years', fees: 145000 },
        ]
      }
    }
  })

  const c4 = await prisma.college.create({
    data: {
      name: 'Vellore Institute of Technology (VIT)',
      location: 'Vellore, Tamil Nadu',
      rating: 4.1,
      averageFees: 480000,
      placement: 88.0,
      description: 'VIT is known for its sprawling campus, massive student intake, and strong placement tie-ups with IT companies.',
      imageUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      cutoffExam: 'VITEEE',
      cutoffRank: 50000,
      courses: {
        create: [
          { name: 'B.Tech in Computer Science', duration: '4 Years', fees: 490000 },
          { name: 'B.Tech in Biotechnology', duration: '4 Years', fees: 450000 },
        ]
      }
    }
  })

  const c5 = await prisma.college.create({
    data: {
      name: 'Delhi University (DU) - North Campus',
      location: 'New Delhi, Delhi NCR',
      rating: 4.4,
      averageFees: 20000,
      placement: 85.0,
      description: 'DU North Campus colleges are premier institutions for arts, commerce, and science with very low fees and great ROI.',
      imageUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      cutoffExam: 'CUET',
      cutoffRank: 750, // Using score for CUET
      courses: {
        create: [
          { name: 'B.Com (Hons)', duration: '3 Years', fees: 18000 },
          { name: 'B.Sc (Hons) Physics', duration: '3 Years', fees: 22000 },
        ]
      }
    }
  })

  console.log('Database seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
