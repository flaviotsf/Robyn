import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useLoginRequired() {
  const router = useRouter();
  const cookies = useCookies();
  useEffect(() => {
    if (cookies.get('session') != null) {
      router.push('/admin');
    } else {
      router.push('/login');
    }
  }, [router, cookies]);
}
