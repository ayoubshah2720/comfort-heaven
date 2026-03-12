-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "headerOrder" INTEGER,
ADD COLUMN     "showInHeader" BOOLEAN NOT NULL DEFAULT false;
