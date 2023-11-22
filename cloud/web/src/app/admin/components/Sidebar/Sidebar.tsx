'use client';

import { Button } from '@/components/ui/button';
import { JSON_FETCHER } from '@/lib/fetcher';
import { RobynJob } from '@/types/RobynJob';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import useSWR from 'swr';

export function Sidebar() {
  const params = useParams();
  const path = usePathname();

  const shouldFetch = params.id != null;
  const { data } = useSWR<RobynJob>(
    shouldFetch ? `/api/jobs/${params.id}` : null,
    JSON_FETCHER
  );
  const scenarios = data?.models ?? [];
  const isCompleted = data?.state === 'COMPLETED';
  const hasScenarios = scenarios.length > 0;
  const showScenarioNav = isCompleted && hasScenarios;
  return (
    <div className="transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[30] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 dark:bg-gray-800 dark:border-gray-700">
      <div className="space-y-4 py-4 my-6">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={path === '/admin' ? 'secondary' : 'ghost'}
              className="w-full justify-start py-2"
            >
              <Link href={`/admin`} className="py-5">
                <span>Jobs</span>
              </Link>
            </Button>
          </div>
        </div>
        {showScenarioNav && (
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Scenarios
            </h2>
            <div className="flex flex-col gap-1">
              {scenarios.map((scenario, scenarioIndex) => (
                <Button
                  key={scenario}
                  asChild
                  variant={
                    path.startsWith(`/admin/jobs/${params.id}/${scenario}`)
                      ? 'secondary'
                      : 'ghost'
                  }
                  className="w-full justify-start py-2"
                >
                  <Link
                    href={`/admin/jobs/${params.id}/${scenario}`}
                    className="py-5"
                  >
                    <div className="flex flex-row gap-2">
                      <span>Scenario {scenarioIndex + 1}</span>
                      <span className="text-[11px] font-semibold text-gray-400">
                        ({scenario})
                      </span>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
