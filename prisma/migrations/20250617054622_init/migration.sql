-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "createdAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verifyTokenExpiry" SET DEFAULT CURRENT_TIMESTAMP;
