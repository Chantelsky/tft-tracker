<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDataDragon } from '@/composables/useDataDragon'
import AppHeader from '@/components/AppHeader.vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  region: string
  matchId: string
}>()

const { championImages, traitImages, traitNames } = useDataDragon()
const router = useRouter()

const participants = ref<any[]>([])
const isLoading = ref(false)
const errorMsg = ref<string | null>(null)
const gameDatetime = ref<number | null>(null)

async function fetchMatch() {
  isLoading.value = true
  errorMsg.value = null

  try {
    const res = await fetch(
      `http://localhost:3000/api/match/${props.region}/${props.matchId}`
    )
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch match')
    }

    participants.value = data.participants.sort(
      (a: any, b: any) => a.placement - b.placement
    )
    gameDatetime.value = data.gameDatetime
  } catch (error) {
    errorMsg.value = 'Failed to fetch match data'
  } finally {
    isLoading.value = false
  }
}

watch(() => props.matchId, fetchMatch, { immediate: true })

function costBorderClass(rarity: number): string {
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
</script>

<template>
  <div class="min-h-screen bg-bg p-8">
    <AppHeader />

    <button
      @click="router.back()"
      class="text-text-secondary text-xs mb-2 inline-block cursor-pointer"
    >
      ← Back to search
    </button>
    <h2 class="text-text-primary text-lg font-medium mb-1">Match detail</h2>
    <p class="text-text-muted text-xs mb-6">
      Ranked TFT · {{ region }}
      <span v-if="gameDatetime">
        · {{ new Date(gameDatetime).toLocaleDateString() }}</span
      >
    </p>

    <p v-if="errorMsg" class="text-danger text-sm">{{ errorMsg }}</p>

    <div class="flex flex-col gap-1.5 max-w-5xl mx-auto">
      <div
        v-for="participant in participants"
        :key="participant.puuid"
        class="flex items-center gap-3 bg-surface border border-border rounded-lg p-3"
        :class="
          participant.placement <= 4
            ? 'border-l-3 border-l-success'
            : 'border-l-3 border-l-danger'
        "
      >
        <div
          class="w-8 h-8 rounded-md border-2 flex items-center justify-center text-sm font-semibold"
          :class="
            participant.placement <= 4
              ? 'border-success text-success'
              : 'border-danger text-danger'
          "
        >
          {{ participant.placement }}
        </div>

        <img
          :src="`https://api.dicebear.com/10.x/bottts/svg?seed=${participant.puuid}`"
          class="w-8 h-8 rounded-full bg-card"
          alt="avatar"
        />

        <div class="w-28 shrink-0">
          <p
            class="text-text-primary text-xs truncate"
            :title="participant.riotIdGameName"
          >
            {{ participant.riotIdGameName }}
          </p>
          <p class="text-text-muted text-[10px]">Lvl {{ participant.level }}</p>
        </div>

        <div class="flex gap-1 flex-1">
          <div
            v-for="unit in participant.units"
            :key="unit.characterId"
            class="text-center"
          >
            <p class="text-accent-light text-[9px] leading-none mb-0.5">
              {{ '★'.repeat(unit.tier) }}
            </p>
            <img
              :src="championImages[unit.characterId]"
              :alt="unit.characterId"
              class="w-8 h-8 rounded bg-card border-2"
              :class="costBorderClass(unit.rarity)"
            />
          </div>
        </div>
        <div class="flex gap-1 items-end">
          <img
            v-for="trait in participant.traits"
            :key="trait.name"
            :src="traitImages[trait.name]"
            :alt="trait.name"
            :title="`${traitNames[trait.name]} (${trait.numUnits})`"
            class="w-7 h-7"
          />
        </div>
      </div>
    </div>
  </div>
</template>
