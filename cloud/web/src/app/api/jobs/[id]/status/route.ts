import prisma from '@/db/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const jobId = parseInt(context.params.id);
    const data = cookies().get('session')?.value ?? '';
    const decodedToken = jwt.decode(data) as { id: number };
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        ownerId: decodedToken.id,
      },
      select: {
        id: true,
      },
    });
    if (job == null) {
      return NextResponse.error();
    }

    const jobLog = await prisma.jobLog.findFirst({
      where: {
        id: jobId,
      },
      select: {
        id: true,
        log: true,
      },
    });

    return NextResponse.json(jobLog, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    return NextResponse.error();
  }
}
