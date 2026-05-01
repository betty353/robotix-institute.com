import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createApiResponse, rateLimiter, validateInput } from '@/lib/api-utils';
import prisma from '@/lib/prisma';

const schema = z.object({
  email: z.string().email(),
});

/**
 * Forgot-password endpoint.
 *
 * For security we ALWAYS return 200 success regardless of whether the email
 * exists, to prevent user enumeration. In a future iteration this will:
 *   1. Generate a cryptographically random reset token
 *   2. Store a hash of the token + 1h expiry on the User row
 *   3. Email the user via Resend with a /reset-password?token=... link
 *
 * For now, we just record the request so admins can audit it.
 */
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!rateLimiter(ip, 5, 60_000)) {
    return NextResponse.json(
      createApiResponse({ ok: true }, 'If an account exists, a reset link has been sent.'),
      { status: 200 }
    );
  }

  try {
    const body = await request.json();
    const validation = validateInput(schema, body);
    if (!validation.success) {
      // Same response either way to prevent enumeration
      return NextResponse.json(
        createApiResponse({ ok: true }, 'If an account exists, a reset link has been sent.'),
        { status: 200 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: validation.data!.email },
      select: { id: true, isActive: true },
    });

    if (user && user.isActive) {
      // TODO: integrate Resend + create PasswordResetToken model
      console.info('[forgot-password] reset requested for user', user.id);
    }
  } catch (e) {
    console.error('forgot-password error:', e);
  }

  return NextResponse.json(
    createApiResponse({ ok: true }, 'If an account exists, a reset link has been sent.'),
    { status: 200 }
  );
}
