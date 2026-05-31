-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "careAndCleaning" TEXT,
ADD COLUMN     "comparePriceCents" INTEGER,
ADD COLUMN     "dimensions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "productDetails" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "specifications" JSONB,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
