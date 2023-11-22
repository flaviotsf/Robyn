'use client';

import { Button } from '@/components/ui/button';
import { PlatformLearnMore } from './components/PlatformLearnMore/PlatformLearnMore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const items: Array<PlatformLearnMore> = [
  {
    logoUrl: '/platforms/meta.png',
    name: 'Meta',
    url: '#',
  },
  {
    logoUrl: '/platforms/google.png',
    name: 'Google',
    url: '#',
  },
  {
    logoUrl: '/platforms/nielsen.png',
    name: 'Nielsen',
    url: '#',
  },
  {
    logoUrl: '/platforms/tiktok.png',
    name: 'TikTok',
    url: '#',
  },
  {
    logoUrl: '/platforms/netflix.png',
    name: 'Netflix',
    url: '#',
  },
];

function Page(): JSX.Element {
  const [data, setData] = useState<File | null>(null);
  const router = useRouter();
  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data == null) {
      return;
    }
    const body = new FormData();
    body.append('dataFile', data);
    const response = await fetch('/api/jobs', {
      method: 'POST',
      body,
    }).then((r) => r.json());
    router.push(`/admin/create/${response.id}/settings`);
  };
  return (
    <div className="flex flex-col px-8">
      <form onSubmit={onFormSubmit}>
        <h1 className="font-semibold text-lg mt-8">Data upload</h1>
        <p className="mt-4">
          First, let’s securely upload your data. We have step by step guides on
          where to get your marketing data:
        </p>

        <div className="flex gap-4 mt-3">
          {items.map((item) => (
            <PlatformLearnMore platform={item} key={item.logoUrl} />
          ))}
        </div>
        <Link
          href="/data/template.csv"
          target="_blank"
          className="text-xs text-gray-600 mt-2"
        >
          Download a sample data file template
        </Link>
        <div className="flex flex-row gap-x-4 mt-8 w-full">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="dataFile">Data File</Label>

            <Input
              id="dataFile"
              name="dataFile"
              type="file"
              onChange={(e) => {
                if (e.target.files != null && e.target.files.length > 0) {
                  setData(e.target.files[0]);
                }
              }}
              accept=".csv"
            />
          </div>
        </div>
        <div className="mt-8 text-end">
          <Button disabled={data == null}>Next</Button>
        </div>
      </form>
    </div>
  );
}

export default Page;
