import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserId } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: {
          select: { username: true, avatarUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ articles }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content, readTime } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        readTime: readTime || 5,
        authorId: userId
      },
      include: {
        author: {
          select: { username: true, avatarUrl: true }
        }
      }
    })

    return NextResponse.json({ article }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
