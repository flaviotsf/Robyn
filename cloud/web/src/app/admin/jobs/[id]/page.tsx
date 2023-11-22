import { getUserID } from '@/lib/auth';
import { getModels } from '@/lib/jobs';
import { redirect } from 'next/navigation';

async function Page({ params }: { params: { id: string } }) {
  const userId = getUserID();
  const jobId = parseInt(params.id);
  const models = await getModels({ userId, jobId });
  if (models.length > 0) {
    redirect(`/admin/jobs/${jobId}/${models[0]}`);
  } else {
    redirect(`/admin`);
  }
}

export default Page;
