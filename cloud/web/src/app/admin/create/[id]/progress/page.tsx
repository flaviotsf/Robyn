'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { JSON_FETCHER } from '@/lib/fetcher';
import { RobynJobStatus } from '@/types/RobyJobStatus';
import { RobynJob } from '@/types/RobynJob';
import {
  Check,
  LayoutTemplate,
  Loader2,
  Terminal,
  Undo2,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import useSWR, { useSWRConfig } from 'swr';

type AlertIconProps = { state: string };
function AlertIcon({ state }: AlertIconProps) {
  if (state === 'IN_PROGRESS') {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  if (state === 'COMPLETED') {
    return <Check className="h-4 w-4 stroke-green-600" />;
  }

  if (state === 'ERROR') {
    return <XCircle className="h-4 w-4" />;
  }

  return <Terminal className="h-4 w-4" />;
}
function Page(): JSX.Element | null {
  const params: { id: string } = useParams();
  const { mutate } = useSWRConfig();

  const { data } = useSWR<RobynJob>(`/api/jobs/${params.id}`, JSON_FETCHER, {
    refreshInterval: 5000,
    revalidateOnMount: true,
  });

  const { data: statusData, isLoading: isLoadingStatusData } =
    useSWR<RobynJobStatus>(`/api/jobs/${params.id}/status`, JSON_FETCHER, {
      revalidateIfStale: true,
      refreshInterval: 2000,
      revalidateOnMount: true,
      revalidateOnFocus: true,
    });

  useEffect(() => {
    mutate(`/api/jobs/${params.id}/status`);
  }, [mutate, params.id]);

  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current?.scrollHeight;
    }
  }, [statusData, logRef]);

  const runModel = async () => {
    await fetch(`/api/jobs/${params.id}/start`, {
      method: 'POST',
    });
    await mutate(`/api/jobs/${params.id}`);
  };

  const descriptions: Record<string, string> = {
    COMPLETED: ' Your job completed successfully.',
    FAILED: 'Your job failed to run.',
    IN_PROGRESS: 'Your job is running.',
    DRAFT:
      'Model runs can take anywhere from 5 minutes for 200 iterations to 30 minutes for 2,000 iterations at 5 trials.',
  };

  const state = data?.state ?? 'UNKNOWN';

  return (
    <div>
      <h1 className="text-lg font-semibold">Model Execution</h1>
      <Alert
        variant={state === 'FAILED' ? 'destructive' : 'default'}
        className={`my-6 ${
          state === 'COMPLETED'
            ? 'border-green-600 bg-green-50 text-green-600'
            : ''
        }`}
      >
        <AlertIcon state={state} />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>{descriptions[state] ?? ''}</AlertDescription>
      </Alert>
      <div className="flex flex-row gap-2">
        {data?.state === 'DRAFT' && (
          <Button onClick={runModel} className="w-2/12">
            Run Model
          </Button>
        )}
        {data?.state === 'COMPLETED' && (
          <Button asChild variant="secondary">
            <Link href={`/admin/jobs/${params.id}`}>
              <LayoutTemplate size={14} className="mr-1" />
              View Report
            </Link>
          </Button>
        )}
        {!['DRAFT', 'IN_PROGRESS'].includes(state) && (
          <Button variant="outline" onClick={runModel}>
            <Undo2 size={14} className="mr-1" />
            Run again
          </Button>
        )}
      </div>
      {state !== 'DRAFT' && (
        <div
          ref={logRef}
          className="mt-8 max-h-80 max-w-2xl overflow-scroll w-full text-sm bg-slate-950 text-white border rounded-lg p-8"
        >
          <pre>{!isLoadingStatusData && statusData?.log}</pre>
        </div>
      )}
    </div>
  );
}

export default Page;
