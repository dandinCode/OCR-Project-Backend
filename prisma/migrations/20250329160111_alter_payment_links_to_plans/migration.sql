/*
  Warnings:

  - You are about to drop the column `PaymentLinks` on the `Plans` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plans" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL,
    "themeColor" TEXT,
    "paymentLinks" TEXT
);
INSERT INTO "new_Plans" ("id", "name", "price", "themeColor", "tokens") SELECT "id", "name", "price", "themeColor", "tokens" FROM "Plans";
DROP TABLE "Plans";
ALTER TABLE "new_Plans" RENAME TO "Plans";
CREATE UNIQUE INDEX "Plans_name_key" ON "Plans"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
