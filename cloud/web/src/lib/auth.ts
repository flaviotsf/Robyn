import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export function getUserID() {
  const data = cookies().get('session')?.value ?? '';
  const decodedToken = jwt.decode(data) as { id: number };
  return decodedToken.id;
}
