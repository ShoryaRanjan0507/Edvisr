import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserId } from '@/lib/auth'

export async function GET() {
  try {
    const userId = await getUserId()

    if (!userId) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      )
    }

    return NextResponse.json({ user }, { status: 200 })

  } catch (error) {
    console.error('Fetch user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getUserId()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { bio, phone, avatarUrl } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        bio,
        phone,
        avatarUrl
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ user: updatedUser }, { status: 200 })

  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
