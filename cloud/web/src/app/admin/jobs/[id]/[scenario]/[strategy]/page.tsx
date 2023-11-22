/* eslint-disable @next/next/no-img-element */

import { JobNav } from '@/components/nav/JobNav';

function Page({
  params,
}: {
  params: { id: string; scenario: string; strategy: string };
}): JSX.Element {
  return (
    <div>
      <JobNav
        id={params.id}
        scenario={params.scenario}
        strategy={params.strategy}
      />
      <div className="rounded-lg border h-full overflow-hidden mb-20">
        <img
          alt={`Scenario ${params.scenario}`}
          src={`/api/jobs/${params.id}/${params.scenario}/${params.strategy}`}
          className="w-9/12 h-auto"
        />
      </div>
    </div>
  );
}

export default Page;
