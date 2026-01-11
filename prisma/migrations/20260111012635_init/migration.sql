-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "botonistas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "descricao" TEXT,
    "time" TEXT DEFAULT 'Sport',
    "categoria" TEXT NOT NULL DEFAULT 'ADULTO',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT,
    CONSTRAINT "botonistas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "campeonatos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "descricao" TEXT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "peso" REAL NOT NULL DEFAULT 1.0,
    "tipo" TEXT NOT NULL DEFAULT 'INTERNO'
);

-- CreateTable
CREATE TABLE "resultados" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "colocacao" INTEGER NOT NULL,
    "divisao" INTEGER NOT NULL DEFAULT 1,
    "jogos" INTEGER NOT NULL DEFAULT 0,
    "vitorias" INTEGER NOT NULL DEFAULT 0,
    "empates" INTEGER NOT NULL DEFAULT 0,
    "derrotas" INTEGER NOT NULL DEFAULT 0,
    "golsPro" INTEGER NOT NULL DEFAULT 0,
    "golsContra" INTEGER NOT NULL DEFAULT 0,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "botonistaId" TEXT NOT NULL,
    "campeonatoId" TEXT NOT NULL,
    CONSTRAINT "resultados_botonistaId_fkey" FOREIGN KEY ("botonistaId") REFERENCES "botonistas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "resultados_campeonatoId_fkey" FOREIGN KEY ("campeonatoId") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pagina" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Conquista" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "ano" TEXT NOT NULL,
    "imagemUrl" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'ESTADUAL',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Noticia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "subtitulo" TEXT,
    "conteudo" TEXT NOT NULL,
    "imagemUrl" TEXT,
    "link" TEXT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publicada" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "botonistas_usuarioId_key" ON "botonistas"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Pagina_slug_key" ON "Pagina"("slug");
