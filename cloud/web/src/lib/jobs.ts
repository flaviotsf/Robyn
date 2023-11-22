import prisma from '@/db/db';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export async function getExportFolder({
  userId,
  jobId,
}: {
  userId: number;
  jobId: number;
}) {
  const exportFolder = join(
    process.cwd(),
    `/robyn-data/output/${userId}/${jobId}/export_folder.csv`
  );
  if (existsSync(exportFolder)) {
    const file = readFileSync(exportFolder);
    return file
      .toString('utf-8')
      .split('\n')
      .slice(1)
      .map((v) => v.replace(/^"|"$/g, ''))
      .filter(Boolean);
  }
  return [];
}

export async function getModels({
  userId,
  jobId,
}: {
  userId: number;
  jobId: number;
}) {
  const topModelsPath = join(
    process.cwd(),
    `/robyn-data/output/${userId}/${jobId}/top_models.csv`
  );
  if (existsSync(topModelsPath)) {
    const list = readFileSync(topModelsPath);
    return list
      .toString('utf-8')
      .split('\n')
      .slice(1)
      .map((v) => v.replace(/^"|"$/g, ''))
      .filter(Boolean);
  }
  return [];
}

export async function getJob({
  userId,
  jobId,
}: {
  userId: number;
  jobId: number;
}) {
  const job = await prisma.job.findFirst({
    where: {
      ownerId: userId,
      id: jobId,
    },
    select: {
      id: true,
      filename: true,
      state: true,
      createdAt: true,
      columns: true,
      topModels: true,
      exportFolder: true,
      settings: true,
    },
  });
  return job;
}
