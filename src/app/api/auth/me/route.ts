import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { createApiResponse, createErrorResponse } from '@/lib/api-utils';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const jwtUser = getUserFromRequest(request);
    if (!jwtUser) {
      return NextResponse.json(
        createErrorResponse('Unauthorized'),
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: jwtUser.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        bio: true,
        githubUrl: true,
        linkedinUrl: true,
        points: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            codeProjects: true,
            robotProjects: true,
            forumPosts: true,
            certificates: true,
            achievements: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        createErrorResponse('User not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(createApiResponse(user));
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
