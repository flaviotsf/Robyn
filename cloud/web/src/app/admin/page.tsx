import { JobDataTable } from '@/app/admin/components/DataTable/JobDataTable';
import { Button } from '@/components/ui/button';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/db/db';
import { Plus } from 'lucide-react';
import Link from 'next/link';

async function getData() {
  const data = cookies().get('session')?.value ?? '';
  const decodedToken = jwt.decode(data) as { id: number };
  return await prisma.job.findMany({
    where: {
      ownerId: decodedToken.id,
    },
    select: {
      id: true,
      filename: true,
      state: true,
      createdAt: true,
      columns: true,
    },
  });
}

async function Page(): Promise<JSX.Element> {
  const jobs = await getData();
  return (
    <div className="hidden h-full flex-1 flex-col space-y-2 px-8 md:flex">
      <div className="flex flex-row items-center m-2 justify-between">
        <h2 className="font-semibold">Jobs</h2>
        <div className="text-right">
          <Button variant="default" className="w-full justify-start" asChild>
            <Link href="/admin/create">
              <Plus />
              <span className="ml-2">Create new job</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-0 bg-white">
        <JobDataTable data={jobs} />
      </div>
    </div>
  );
}

export default Page;
