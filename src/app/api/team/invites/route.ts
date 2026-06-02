import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { getUserFromRequest, requireRole } from '@/lib/auth';
import { createApiResponse, createErrorResponse, sanitizeInput, validateInput } from '@/lib/api-utils';
import { getAppOrigin, sendTeamInviteEmail } from '@/lib/mailer';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const inviteSchema = z.object({
  email: z.string().email('A valid email address is required'),
  firstName: z.string().min(2, 'First name is required').max(80),
  lastName: z.string().min(2, 'Last name is required').max(80),
  role: z.enum(['ADMIN', 'ACCOUNTANT', 'INSTRUCTOR']),
});

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const denied = await requireRole(user, ['ADMIN']);
    if (denied) return denied;

    const invites = await prisma.teamInvite.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        expiresAt: true,
        acceptedAt: true,
        createdAt: true,
        invitedBy: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    return NextResponse.json(createApiResponse(invites));
  } catch (error) {
    console.error('team invites GET error:', error);
    return NextResponse.json(createErrorResponse('Internal server error'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const denied = await requireRole(user, ['ADMIN']);
    if (denied) return denied;

    const body = await request.json();
    const validation = validateInput(inviteSchema, body);
    if (!validation.success) {
      return NextResponse.json(createErrorResponse('Validation failed', validation.errors), { status: 400 });
    }

    const payload = validation.data!;
    const email = sanitizeInput(payload.email).toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      return NextResponse.json(createErrorResponse('A user already exists with this email'), { status: 409 });
    }

    const token = crypto.randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 2);
    const inviteUrl = `${getAppOrigin()}/invite/${encodeURIComponent(token)}`;

    const invite = await prisma.teamInvite.create({
      data: {
        email,
        firstName: sanitizeInput(payload.firstName),
        lastName: sanitizeInput(payload.lastName),
        role: payload.role as Role,
        tokenHash: hashToken(token),
        expiresAt,
        invitedById: user!.userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        expiresAt: true,
        acceptedAt: true,
        createdAt: true,
      },
    });

    let emailSent = false;
    try {
      await sendTeamInviteEmail({
        to: email,
        firstName: invite.firstName,
        role: invite.role,
        inviteUrl,
        expiresAt,
      });
      emailSent = true;
    } catch (error) {
      console.error('team invite email error:', error);
    }

    return NextResponse.json(
      createApiResponse(
        { invite, inviteUrl, emailSent },
        emailSent
          ? 'Invitation sent. The invite link expires in 2 hours.'
          : 'Invitation created. Email delivery is not configured, so copy the invite link. The link expires in 2 hours.'
      ),
      { status: 201 }
    );
  } catch (error) {
    console.error('team invites POST error:', error);
    return NextResponse.json(createErrorResponse('Internal server error'), { status: 500 });
  }
}
