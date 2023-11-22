import prisma from '@/db/db';
import { getUserID } from '@/lib/auth';
import { getJob, getModels } from '@/lib/jobs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const userId = getUserID();
    const jobId = parseInt(context.params.id);
    const job = await getJob({ jobId, userId });
    const models = await getModels({
      userId,
      jobId,
    });
    return NextResponse.json({ ...job, models });
  } catch (e) {
    return NextResponse.error();
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const jobId = parseInt(context.params.id);
    const sessionData = cookies().get('session')?.value ?? '';
    const decodedToken = jwt.decode(sessionData) as { id: number };
    const data = await request.json();
    const job = await prisma.job.update({
      where: {
        ownerId: decodedToken.id,
        id: jobId,
      },
      data,
      select: {
        id: true,
        columns: true,
        createdAt: true,
        exportFolder: true,
        filename: true,
        ownerId: true,
        settings: true,
        state: true,
        topModels: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(job);
  } catch (e) {
    return NextResponse.error();
  }
}
