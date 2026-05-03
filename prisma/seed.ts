import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.bookmark.deleteMany()
  await prisma.article.deleteMany()
  await prisma.question.deleteMany()
  await prisma.user.deleteMany()
  await prisma.course.deleteMany()
  await prisma.college.deleteMany()

  // Create Users
  const passwordHash = await bcrypt.hash('password123', 10)
  
  const user1 = await prisma.user.create({
    data: {
      username: 'rohit',
      email: 'rohit@example.com',
      passwordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      bio: 'Aspiring engineering student exploring top colleges.',
    }
  })

  const user2 = await prisma.user.create({
    data: {
      username: 'sneha',
      email: 'sneha@example.com',
      passwordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      bio: 'Senior counselor and education enthusiast.',
    }
  })

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

  // Create Dummy Questions
  await prisma.question.create({
    data: {
      title: 'Is IIT Delhi CS worth giving up an Ivy League admission?',
      content: 'I have been admitted to Cornell for CS but also secured a top 100 rank in JEE Advanced. Which one provides better long-term ROI and research opportunities?',
      authorId: user1.id,
      upvotes: 42,
    }
  })

  await prisma.question.create({
    data: {
      title: 'How is the hostel life at BITS Pilani?',
      content: 'I heard BITS has a zero-attendance policy. Does that make the hostel life very different from NITs?',
      authorId: user1.id,
      upvotes: 15,
    }
  })

  // Create Dummy Articles
  await prisma.article.create({
    data: {
      title: 'The Ultimate Guide to Surviving Your First Year of Engineering',
      content: 'Engineering can be daunting. Here are 5 tips to make sure you stay on top of your coursework while enjoying college life: 1. Manage your time. 2. Join clubs. 3. Do not ignore sleep. 4. Network with seniors. 5. Keep learning new skills.',
      authorId: user2.id,
      readTime: 4,
    }
  })

  await prisma.article.create({
    data: {
      title: 'Why Placements Aren\'t Everything',
      content: 'Many students fixate solely on the "Highest Package" advertised by colleges. In this article, I discuss why curriculum, peer group, and alumni networks matter much more for your 10-year trajectory.',
      authorId: user2.id,
      readTime: 6,
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
