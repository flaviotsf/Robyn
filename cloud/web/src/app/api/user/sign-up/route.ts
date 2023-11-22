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
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashPassword(password),
      },
      select: {
        id: true,
        email: true,
      },
    });
    if (user === null) {
      return NextResponse.json(
        { error: `Could not crete the user` },
        { status: 500 }
      );
    }

    const token = jwt.sign(user, process.env.JWT_SECRET as string, {
      expiresIn: 30 * 24 * 60 * 60,
    });
    cookies().set('session', token);
    return NextResponse.json({
      id: user.id,
      email: user.email,
    });
  } catch (e) {
    return NextResponse.json(
      { error: `Could not crete the user` },
      { status: 500 }
    );
  }
}
