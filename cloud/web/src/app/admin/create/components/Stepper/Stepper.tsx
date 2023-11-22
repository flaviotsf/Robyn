'use client';
import { JSON_FETCHER } from '@/lib/fetcher';
import { RobynJob } from '@/types/RobynJob';
import { Check } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import useSWR from 'swr';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Stepper() {
  const pathname = usePathname();
  let activeStepIndex = 0;
  if (/\/admin\/create\/(\d+)\/settings/.test(pathname)) {
    activeStepIndex = 1;
  } else if (/\/admin\/create\/(\d+)\/progress/.test(pathname)) {
    activeStepIndex = 2;
  }

  const params = useParams();
  const data = useSWR<RobynJob>(`/api/jobs/${params.id}`, JSON_FETCHER);
  const isComplete = data?.data?.state === 'COMPLETED';
  const steps = [
    { name: 'Data Upload' },
    { name: 'Settings' },
    { name: 'Run Model' },
  ];

  return (
    <ol className="flex items-center w-full text-sm font-medium text-center ">
      {steps.map((step, stepIndex) => (
        <li
          key={stepIndex}
          className="md:w-full items-center flex flex-row justify-center"
        >
          <div
            className={`flex-shrink-0 m-3 flex h-8 w-8 items-center justify-center rounded-full ${
              stepIndex === activeStepIndex
                ? 'bg-slate-950 text-white'
                : stepIndex < activeStepIndex || isComplete
                  ? 'bg-green-100 text-green-600'
                  : 'bg-slate-200 text-gray-900'
            }`}
          >
            <p>
              {stepIndex < activeStepIndex ? (
                <Check size={16} />
              ) : (
                stepIndex + 1
              )}
            </p>
          </div>
          <div>{step.name}</div>
        </li>
      ))}
    </ol>
  );
}
