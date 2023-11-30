import prisma from '@/db/db';
import { RobynJobSetting } from '@/types/RobynJobSetting';
import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const data = cookies().get('session')?.value ?? '';
  const decodedToken = jwt.decode(data) as { id: number; email: string };
  const userID = decodedToken.id;
  const jobID = parseInt(context.params.id);
  const logs: string[] = [];

  const updateLogs = async () => {
    await prisma.jobLog.upsert({
      create: {
        id: jobID,
        log: logs.join('\n'),
      },
      update: {
        log: logs.join('\n'),
      },
      where: {
        id: jobID,
      },
    });
  };

  await updateLogs();

  setInterval(async () => {
    await updateLogs();
  }, 5000);

  try {
    const job = await prisma.job.findFirst({
      where: {
        ownerId: userID,
        id: jobID,
      },
      select: {
        id: true,
        state: true,
        settings: true,
      },
    });

    if (job == null) {
      return;
    }

    const settings = JSON.parse(job.settings ?? '') as RobynJobSetting;
    const dateField = settings.dateColumn;
    const depVarField = settings.depVarColumn;
    const depVarType =
      settings.depVarColumnType === 'REVENUE' ? 'revenue' : 'conversion';
    const countryCode = settings.countryCode;
    const contextVars =
      settings.contextVars?.map((p) => p.eventColumn).join(',') ?? '';
    const paidMediaSpends =
      settings.paidMediaVars?.map((p) => p.spendColumn).join(',') ?? '';
    const paidMediaVars =
      settings.paidMediaVars?.map((p) => p.eventColumn).join(',') ?? '';
    const organicVars =
      settings.organicVars?.map((p) => p.eventColumn).join(',') ?? '';
    const startDate = settings.startDate;
    const endDate = settings.endDate;
    const iterations = settings.iterations;
    const trials = settings.trials;
    const totalBudget = settings.budget;

    const uploadFolder = join(
      process.cwd(),
      `/robyn-data/uploads/${userID}/${job.id}/`
    );

    await prisma.job.update({
      where: {
        ownerId: userID,
        id: jobID,
      },
      data: {
        state: 'IN_PROGRESS',
      },
    });

    const runnerPath = join(process.cwd(), `/runner/robyn-runner.R`);
    const outDirectory = join(
      process.cwd(),
      `/robyn-data/output/${userID}/${job.id}`
    );
    if (!existsSync(outDirectory)) {
      mkdirSync(outDirectory, { recursive: true });
    }

    const args = [
      `--id=${job.id}`,
      `--file="${uploadFolder}data.csv"`,
      `--date_field="${dateField}"`,
      `--dep_var="${depVarField}"`,
      `--dep_var_type="${depVarType}"`,
      `--country_code="${countryCode}"`,
      `--context_vars="${contextVars}"`,
      `--paid_media_spends="${paidMediaSpends}"`,
      `--paid_media_vars="${paidMediaVars}"`,
      `--organic_vars="${organicVars}"`,
      `--start_date="${startDate?.substring(0, 10)}"`,
      `--end_date="${endDate?.substring(0, 10)}"`,
      `--iterations=${iterations}`,
      `--trials=${trials}`,
      `--total_budget=${totalBudget}`,
      `--out_directory="${outDirectory}"`,
      `--python_path="${process.env.PYTHON_PATH}"`,
    ];

    console.log({ args });

    const child = spawn('Rscript', [runnerPath, ...args], {
      timeout: 0,
      cwd: uploadFolder,
    });

    child.stdout.on('data', (data) => {
      console.log(data.toString('utf8'));
      logs.push(data.toString('utf8'));
    });

    child.stderr.on('data', (data) => {
      console.log(data.toString('utf8'));
      logs.push(data.toString('utf8'));
    });

    child.on('error', async (err) => {
      console.log(err.message);
      logs.push(err.message);
      await prisma.job.update({
        where: {
          ownerId: userID,
          id: jobID,
        },
        data: {
          state: 'FAILED',
        },
      });
    });

    child.on('close', async (code) => {
      if (code === 0) {
        await prisma.job.update({
          where: {
            ownerId: userID,
            id: jobID,
          },
          data: {
            state: 'COMPLETED',
          },
        });
      } else {
        await prisma.job.update({
          where: {
            ownerId: userID,
            id: jobID,
          },
          data: {
            state: 'FAILED',
          },
        });
      }
    });

    return NextResponse.json({});
  } catch (e) {
    await prisma.job.update({
      where: {
        ownerId: userID,
        id: jobID,
      },
      data: {
        state: 'FAILED',
      },
    });
    return NextResponse.error();
  } finally {
    await prisma.jobLog.upsert({
      create: {
        id: jobID,
        log: logs.join('\n'),
      },
      update: {
        log: logs.join('\n'),
      },
      where: {
        id: jobID,
      },
    });
  }
}
