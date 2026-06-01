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

const leadSchema = z.object({
  parentName: z.string().min(2, 'Parent or guardian name is required').max(80),
  parentEmail: z.string().email('A valid parent email is required'),
  parentPhone: z.string().min(7, 'A valid parent phone number is required').max(40),
  childName: z.string().min(2, 'Child name is required').max(80),
  childAge: z.string().min(1, 'Child age is required').max(20),
  childSchool: z.string().max(120).optional().default(''),
  preferredTrack: z.string().min(1, 'Preferred track is required').max(80),
  preferredSchedule: z.string().min(1, 'Preferred schedule is required').max(80),
  notes: z.string().max(800).optional().default(''),
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

    const [leads, total] = await Promise.all([
      prisma.weekendClassLead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.weekendClassLead.count({ where }),
    ]);

    return NextResponse.json(createPaginatedResponse(leads, total, pagination));
  } catch (error) {
    console.error('weekend leads GET error:', error);
    return NextResponse.json(createErrorResponse('Internal server error'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!rateLimiter(`weekend-lead:${ip}`, 10, 60_000)) {
    return NextResponse.json(
      createErrorResponse('Too many sign-up attempts. Please try again shortly.'),
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const validation = validateInput(leadSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse('Validation failed', validation.errors),
        { status: 400 }
      );
    }

    const payload = validation.data!;
    const lead = await prisma.weekendClassLead.create({
      data: {
        parentName: sanitizeInput(payload.parentName),
        parentEmail: sanitizeInput(payload.parentEmail).toLowerCase(),
        parentPhone: sanitizeInput(payload.parentPhone),
        childName: sanitizeInput(payload.childName),
        childAge: sanitizeInput(payload.childAge),
        childSchool: sanitizeInput(payload.childSchool || ''),
        preferredTrack: sanitizeInput(payload.preferredTrack),
        preferredSchedule: sanitizeInput(payload.preferredSchedule),
        notes: sanitizeInput(payload.notes || ''),
      },
    });

    try {
      await sendOpsNotification({
        subject: `Weekend class lead: ${lead.parentName}`,
        preheader: 'Robotix weekend classes',
        replyTo: lead.parentEmail,
        text:
          `Parent: ${lead.parentName}\nEmail: ${lead.parentEmail}\nPhone: ${lead.parentPhone}\n` +
          `Child: ${lead.childName} (${lead.childAge})\nSchool: ${lead.childSchool || 'Not shared'}\n` +
          `Track: ${lead.preferredTrack}\nSchedule: ${lead.preferredSchedule}\n\nNotes:\n${lead.notes || 'None'}`,
        html: `
          <h2 style="margin-bottom:12px;">New weekend class lead</h2>
          <p><strong>Parent:</strong> ${lead.parentName}</p>
          <p><strong>Email:</strong> ${lead.parentEmail}</p>
          <p><strong>Phone:</strong> ${lead.parentPhone}</p>
          <p><strong>Child:</strong> ${lead.childName} (${lead.childAge})</p>
          <p><strong>School:</strong> ${lead.childSchool || 'Not shared'}</p>
          <p><strong>Preferred track:</strong> ${lead.preferredTrack}</p>
          <p><strong>Preferred schedule:</strong> ${lead.preferredSchedule}</p>
          <p><strong>Notes:</strong></p>
          <p style="white-space:pre-wrap;">${lead.notes || 'None'}</p>
        `,
      });
    } catch (error) {
      console.error('weekend lead notification email error:', error);
    }

    return NextResponse.json(
      createApiResponse(
        { id: lead.id, createdAt: lead.createdAt },
        "Weekend sign-up received. Robotix can now follow up with your family."
      ),
      { status: 201 }
    );
  } catch (error) {
    console.error('weekend leads POST error:', error);
    return NextResponse.json(createErrorResponse('Internal server error'), { status: 500 });
  }
}
