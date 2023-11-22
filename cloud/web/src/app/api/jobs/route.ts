import prisma from '@/db/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const data = cookies().get('session')?.value ?? '';
    const decodedToken = jwt.decode(data) as { id: number };
    const results = await prisma.job.findMany({
      where: {
        ownerId: decodedToken.id,
      },
      select: {
        id: true,
        filename: true,
        state: true,
        createdAt: true,
      },
    });
    return NextResponse.json(results);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = cookies().get('session')?.value ?? '';
    const decodedToken = jwt.decode(data) as { id: number; email: string };
    const userID = decodedToken.id;
    const formData = await request.formData();
    const files = formData.getAll('dataFile') as File[];
    const fileToStorage = files[0];
    const buffer = Buffer.from(await fileToStorage.arrayBuffer());
    // Convert buffer to string
    const bufferString = buffer.toString();
    // Get the first line which usually contains the column names
    const firstLine = bufferString.split('\n')[0];
    // Split the first line by comma to get individual column names
    const columnNames = firstLine.split(',');
    const filename = (fileToStorage.name ?? '') as string;
    const job = await prisma.job.create({
      data: {
        filename: filename,
        state: 'DRAFT',
        ownerId: userID,
        columns: JSON.stringify(columnNames),
      },
      select: {
        id: true,
        state: true,
      },
    });

    const uploadFolder = join(
      process.cwd(),
      `/robyn-data/uploads/${userID}/${job.id}/`
    );

    if (!existsSync(uploadFolder)) {
      await mkdir(uploadFolder, { recursive: true });
    }
    await writeFile(`${uploadFolder}/data.csv`, bufferString);
    return NextResponse.json({ id: job.id, state: job.state });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
