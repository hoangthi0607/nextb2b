-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "adminId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
