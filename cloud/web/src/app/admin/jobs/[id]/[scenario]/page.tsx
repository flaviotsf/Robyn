/* eslint-disable @next/next/no-img-element */

import { JobNav } from '@/components/nav/JobNav';

function Page({
  params,
}: {
  params: { id: string; scenario: string };
}): JSX.Element {
  return (
    <div>
      <JobNav id={params.id} scenario={params.scenario} />
      <div className="rounded-lg border h-full overflow-hidden mb-20">
        <img
          alt={`Scenario ${params.scenario}`}
          src={`/api/jobs/${params.id}/${params.scenario}`}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}

export default Page;
