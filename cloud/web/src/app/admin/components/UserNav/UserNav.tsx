'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { JSON_FETCHER } from '@/lib/fetcher';
import { User } from '@prisma/client';
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

export function UserNav() {
  const { remove } = useCookies();
  const { data, isLoading } = useSWR<User>('/api/user', JSON_FETCHER);
  const letter = data?.email.substring(0, 1).toUpperCase();
  const router = useRouter();

  if (isLoading) {
    return <Skeleton className="rounded-full w-6 h-6" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 text-center items-center rounded-full"
        >
          {letter}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{data?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            remove('session');
            router.push('/login');
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
