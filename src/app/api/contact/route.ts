import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserFromRequest, requireRole } from '@/lib/auth';
import {
  createApiResponse,
  createErrorResponse,
  createPaginatedResponse,
  getPaginationParams,
  rateLimiter,
  sanitizeInput,
  validateInput,
} from '@/lib/api-utils';
import { sendOpsNotification } from '@/lib/mailer';
import prisma from '@/lib/prisma';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(80, 'Name is too long'),
  email: z.string().email('A valid email address is required'),
  subject: z.string().max(120, 'Subject is too long').optional().default(''),
  message: z.string().min(10, 'Message is too short').max(4000, 'Message is too long'),
});

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(createErrorResponse('Unauthorized'), { status: 401 });
    }

    const denied = await requireRole(user, ['ADMIN', 'INSTRUCTOR']);
    if (denied) return denied;

    const { searchParams } = new URL(request.url);
    const pagination = getPaginationParams(searchParams);

    const status = searchParams.get('status');
    const where = status ? { status } : {};

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return NextResponse.json(createPaginatedResponse(messages, total, pagination));
  } catch (error) {
    console.error('contact GET error:', error);
    return NextResponse.json(createErrorResponse('Internal server error'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!rateLimiter(`contact:${ip}`, 8, 60_000)) {
    return NextResponse.json(
      createErrorResponse('Too many messages sent. Please try again shortly.'),
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const validation = validateInput(contactSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse('Validation failed', validation.errors),
        { status: 400 }
      );
    }

    const payload = validation.data!;
    const message = await prisma.contactMessage.create({
      data: {
        name: sanitizeInput(payload.name),
        email: sanitizeInput(payload.email).toLowerCase(),
        subject: sanitizeInput(payload.subject || ''),
        message: sanitizeInput(payload.message),
      },
    });

    try {
      await sendOpsNotification({
        subject: `New contact message from ${message.name}`,
        preheader: 'Robotix contact inbox',
        replyTo: message.email,
        text: `Name: ${message.name}\nEmail: ${message.email}\nSubject: ${message.subject || 'General enquiry'}\n\n${message.message}`,
        html: `
          <h2 style="margin-bottom:12px;">New contact message</h2>
          <p><strong>Name:</strong> ${message.name}</p>
          <p><strong>Email:</strong> ${message.email}</p>
          <p><strong>Subject:</strong> ${message.subject || 'General enquiry'}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap;">${message.message}</p>
        `,
      });
    } catch (error) {
      console.error('contact notification email error:', error);
    }

    return NextResponse.json(
      createApiResponse(
        { id: message.id, createdAt: message.createdAt },
        "Thanks. Your message has been delivered to Robotix Institute."
      ),
      { status: 201 }
    );
  } catch (error) {
    console.error('contact POST error:', error);
    return NextResponse.json(createErrorResponse('Internal server error'), { status: 500 });
  }
}
