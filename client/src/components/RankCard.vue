<script setup lang="ts">
import { useDataDragon } from '@/composables/useDataDragon'

const { version } = useDataDragon()

defineProps<{
  gameName: string
  tagLine: string
  profileIconId: number
  tier: string
  rank: string
  leaguePoints: number
  wins: number
  losses: number
}>()

function winRate(wins: number, losses: number): number {
  const total = wins + losses
  if (total === 0) return 0
  return Math.round((wins / total) * 100)
}
</script>

<template>
  <div
    class="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3"
  >
    <img
      :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`"
      class="w-9 h-9 rounded-lg"
      alt="summoner icon"
    />
    <div>
      <p class="text-text-primary text-sm">{{ gameName }}#{{ tagLine }}</p>
      <p class="text-text-secondary text-xs">
        {{ tier }} {{ rank }} · {{ leaguePoints }} LP
      </p>
      <p class="text-text-muted text-xs mt-0.5">
        {{ wins }}W {{ losses }}L · {{ winRate(wins, losses) }}% WR
      </p>
    </div>
  </div>
</template>
