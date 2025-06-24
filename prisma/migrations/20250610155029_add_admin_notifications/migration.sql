/*
  Warnings:

  - Added the required column `description` to the `AdminActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdminActivity" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "metadata" JSONB;

-- CreateTable
CREATE TABLE "AdminNotification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "related_entity" TEXT,
    "related_id" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminNotification_is_read_idx" ON "AdminNotification"("is_read");

-- CreateIndex
CREATE INDEX "AdminNotification_created_at_idx" ON "AdminNotification"("created_at");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
