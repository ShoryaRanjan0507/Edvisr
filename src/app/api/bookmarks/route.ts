import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserId } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        article: true,
        // college: true - if we want to fetch colleges too
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ bookmarks }, { status: 200 })
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

    const { articleId, collegeId } = await request.json()

    if (!articleId && !collegeId) {
      return NextResponse.json({ error: 'articleId or collegeId is required' }, { status: 400 })
    }

    // Toggle logic
    const existing = await prisma.bookmark.findFirst({
      where: {
        userId,
        articleId: articleId || null,
        collegeId: collegeId || null
      }
    })

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } })
      return NextResponse.json({ message: 'Bookmark removed', bookmarked: false }, { status: 200 })
    } else {
      const bookmark = await prisma.bookmark.create({
        data: {
          userId,
          articleId: articleId || null,
          collegeId: collegeId || null
        }
      })
      return NextResponse.json({ message: 'Bookmark added', bookmarked: true, bookmark }, { status: 201 })
    }

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
