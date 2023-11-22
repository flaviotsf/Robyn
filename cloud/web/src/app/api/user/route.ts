import prisma from '@/db/db';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const data = cookies().get('session')?.value ?? '';
    const decodedToken = jwt.decode(data) as { id: number };
    const results = await prisma.user.findFirst({
      where: {
        id: decodedToken.id,
      },
      select: {
        id: true,
        email: true,
      },
    });
    return NextResponse.json(results);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      {
        status: 500,
      }
    );
  }
}
