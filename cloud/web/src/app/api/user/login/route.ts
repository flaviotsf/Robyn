import prisma from '@/db/db';
import { NextRequest, NextResponse } from 'next/server';
import { SHA256 as sha256 } from 'crypto-js';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const hashPassword = (string: string) => {
  return sha256(string).toString();
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = (formData.get('username') ?? '') as string;
    const password = (formData.get('password') ?? '') as string;
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });

    if (user === null) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    if (user?.password === hashPassword(password)) {
      const myUser = {
        id: user.id,
        email: user.email,
      };
      const token = jwt.sign(myUser, process.env.JWT_SECRET as string, {
        expiresIn: 30 * 24 * 60 * 60,
      });
      cookies().set('session', token);
      return NextResponse.json(myUser);
    }

    return NextResponse.json({ error: 'Invalid Password' }, { status: 400 });
  } catch (e: unknown | Error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${e}` },
      { status: 500 }
    );
  }
}
