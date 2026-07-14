-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "placement" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "lastRound" INTEGER NOT NULL,
    "gameDatetime" TIMESTAMP(3) NOT NULL,
    "riotAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchUnit" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "rarity" INTEGER NOT NULL,
    "matchId" TEXT NOT NULL,

    CONSTRAINT "MatchUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchTrait" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "numUnits" INTEGER NOT NULL,
    "tierCurrent" INTEGER NOT NULL,
    "tierTotal" INTEGER NOT NULL,
    "matchId" TEXT NOT NULL,

    CONSTRAINT "MatchTrait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LpSnapshot" (
    "id" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "leaguePoints" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "riotAccountId" TEXT NOT NULL,

    CONSTRAINT "LpSnapshot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_riotAccountId_fkey" FOREIGN KEY ("riotAccountId") REFERENCES "RiotAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchUnit" ADD CONSTRAINT "MatchUnit_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchTrait" ADD CONSTRAINT "MatchTrait_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LpSnapshot" ADD CONSTRAINT "LpSnapshot_riotAccountId_fkey" FOREIGN KEY ("riotAccountId") REFERENCES "RiotAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
