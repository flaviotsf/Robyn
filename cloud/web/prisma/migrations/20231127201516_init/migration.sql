-- AlterTable
ALTER TABLE "Job" ADD COLUMN "settings" TEXT;

-- CreateTable
CREATE TABLE "JobLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "log" TEXT NOT NULL
);
