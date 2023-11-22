import prisma from '@/db/db';
import { getExportFolder } from '@/lib/jobs';
import { readFileSync } from 'fs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { id: string; scenario: string } }
) {
  try {
    const data = cookies().get('session')?.value ?? '';
    const decodedToken = jwt.decode(data) as { id: number };
    const jobId = parseInt(context.params.id);
    const userId = decodedToken.id;
    const job = await prisma.job.findFirst({
      where: {
        ownerId: userId,
        id: jobId,
      },
      select: {
        id: true,
      },
    });

    if (job == null) {
      return new NextResponse(null, { status: 403 });
    }
    const exportFolder = await getExportFolder({ userId, jobId });
    const filePath = `${exportFolder}${context.params.scenario}.png`;
    const imageBuffer = readFileSync(filePath);
    const response = new NextResponse(imageBuffer);
    response.headers.set('content-type', 'image/png');
    return response;
  } catch (e) {
    return NextResponse.json({ e });
  }
}
