'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';

import Image from 'next/image';

type FormType = 'login' | 'register';

type Props = {
  type: FormType;
};

export default function Form({ type }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const isValid =
    email != null &&
    password != null &&
    ((type === 'register' && password.length >= 7) || type === 'login');

  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);
    const body = new FormData();
    body.set('username', email);
    body.set('password', password);
    await fetch(type === 'login' ? '/api/user/login' : '/api/user/sign-up', {
      method: 'POST',
      body,
    })
      .then(async (r) => await r.json())
      .then((r) => {
        if (r.id) {
          router.push('/admin');
        } else if (r.error) {
          setErrorMessage(r.error);
        }
      })
      .catch(() => {
        setErrorMessage('An unexpected error has occured.');
        setLoading(false);
      });
  };
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <Image src="/logo.png" priority alt="Logo" width={120} height={120} />
          <h3 className="text-xl font-semibold">
            {type === 'login' ? 'Sign In' : 'Sign Up'}
          </h3>
          <p className="text-sm text-gray-500">
            {type === 'login'
              ? 'Use your email and password to log in.'
              : 'Create an account with your email and password'}
          </p>
        </div>
        <form
          onSubmit={handleForm}
          className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
        >
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="bob@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(v) => setEmail(v.currentTarget.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(v) => setPassword(v.currentTarget.value)}
            />
          </div>
          <Button disabled={!isValid || loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <p>{type === 'login' ? 'Sign In' : 'Sign Up'}</p>
          </Button>
          {type === 'login' ? (
            <p className="text-center text-sm text-gray-600">
              Don&#39;t have an account?{' '}
              <Link href="/register" className="font-semibold text-gray-800">
                Sign up
              </Link>{' '}
              for free.
            </p>
          ) : (
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-gray-800">
                Sign in
              </Link>{' '}
              instead.
            </p>
          )}
          {errorMessage && (
            <p className="mt-4 text-red-600 font-semibold">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
