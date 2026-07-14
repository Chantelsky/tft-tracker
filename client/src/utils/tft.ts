export function costBorderClass(rarity: number): string {
  switch (rarity) {
    case 0:
      return 'border-gray-400'
    case 1:
      return 'border-green-400'
    case 2:
      return 'border-blue-400'
    case 4:
      return 'border-purple-400'
    case 6:
      return 'border-yellow-400'
    default:
      return 'border-border'
  }
}

export function formatStageRound(lastRound: number): string {
  if (lastRound <= 4) {
    return `1-${lastRound}`
  }
  const afterStage1 = lastRound - 4
  const stage = 2 + Math.floor((afterStage1 - 1) / 7)
  const round = ((afterStage1 - 1) % 7) + 1
  return `${stage}-${round}`
}

export function winRate(entry: { wins: number; losses: number }): number {
  const total = entry.wins + entry.losses
  if (total === 0) return 0
  return Math.round((entry.wins / total) * 100)
}

export function getRankedEntry(rankedInfo: any[]) {
  if (!rankedInfo || rankedInfo.length === 0) {
    return undefined
  }
  return rankedInfo.find((entry) => entry.queueType === 'RANKED_TFT')
}
