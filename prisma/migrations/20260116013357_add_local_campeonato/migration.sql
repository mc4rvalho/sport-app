-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_campeonatos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "descricao" TEXT,
    "local" TEXT NOT NULL DEFAULT 'Ilha do Retiro',
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "peso" REAL NOT NULL DEFAULT 1.0,
    "tipo" TEXT NOT NULL DEFAULT 'INTERNO'
);
INSERT INTO "new_campeonatos" ("data", "descricao", "fotoUrl", "id", "nome", "peso", "tipo") SELECT "data", "descricao", "fotoUrl", "id", "nome", "peso", "tipo" FROM "campeonatos";
DROP TABLE "campeonatos";
ALTER TABLE "new_campeonatos" RENAME TO "campeonatos";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
