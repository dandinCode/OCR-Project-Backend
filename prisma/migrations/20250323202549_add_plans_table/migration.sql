-- CreateTable
CREATE TABLE "Plans" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL,
    "price" Decimal NOT NULL
);
