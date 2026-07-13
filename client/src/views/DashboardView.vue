<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDataDragon } from '@/composables/useDataDragon'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const { championImages, version } = useDataDragon()
const router = useRouter()

const region = ref('OCE')
const gameName = ref('')
const tagLine = ref('')
const isLoading = ref(false)
const errorMsg = ref<string | null>(null)
const summary = ref<any>(null)
const showDropdown = ref(false)

async function handleSearch() {
  isLoading.value = true
  errorMsg.value = null
  summary.value = null

  try {
    const res = await fetch(
      `http://localhost:3000/api/summary/${region.value}/${gameName.value}/${tagLine.value}?count=5`
    )
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Search failed')
    }

    summary.value = data
  } catch (error) {
    errorMsg.value = (error as Error).message
  } finally {
    isLoading.value = false
  }
}

async function handleSignOut() {
  await authStore.logout()
  router.push('/')
}

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

function formatStageRound(lastRound: number): string {
  if (lastRound <= 4) {
    return `1-${lastRound}`
  }
  const afterStage1 = lastRound - 4
  const stage = 2 + Math.floor((afterStage1 - 1) / 7)
  const round = ((afterStage1 - 1) % 7) + 1
  return `${stage}-${round}`
}

function getRankedEntry(rankedInfo: any[]) {
  if (!rankedInfo || rankedInfo.length === 0) {
    return undefined
  }
  return rankedInfo.find((entry) => entry.queueType === 'RANKED_TFT')
}

function winRate(entry: { wins: number; losses: number }): number {
  const total = entry.wins + entry.losses
  if (total === 0) return 0
  return Math.round((entry.wins / total) * 100)
}
</script>

<template>
  <div class="min-h-screen bg-bg p-8">
    <div class="flex items-center justify-between mb-10 relative">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-md bg-accent"></div>
        <span class="text-text-primary font-medium text-sm"
          >Tactician's Desk</span
        >
      </div>

      <div class="relative">
        <img
          :src="`https://api.dicebear.com/10.x/bottts/svg?seed=${authStore.userId}`"
          class="w-8 h-8 rounded-full bg-card cursor-pointer"
          alt="avatar"
          @click="showDropdown = !showDropdown"
        />
        <div
          v-if="showDropdown"
          class="absolute top-10 right-0 w-44 bg-surface border border-border rounded-lg p-1.5 z-10"
        >
          <p
            class="text-text-primary text-xs px-2.5 py-2 border-b border-border mb-1"
          >
            {{ authStore.userEmail }}
          </p>
          <button
            @click="handleSignOut"
            class="w-full text-left text-danger text-sm px-2.5 py-1.5 rounded hover:bg-bg cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>

    <h1 class="text-text-primary text-2xl font-medium text-center mb-1">
      Look up a player
    </h1>
    <p class="text-text-muted text-sm text-center mb-6">
      Enter a Riot ID to see recent TFT matches
    </p>

    <form
      @submit.prevent="handleSearch"
      class="flex gap-2 max-w-lg mx-auto mb-10"
    >
      <select
        v-model="region"
        class="bg-surface border border-border rounded-md h-9 px-2 text-sm text-text-primary"
      >
        <option value="NA">NA</option>
        <option value="EUW">EUW</option>
        <option value="EUNE">EUNE</option>
        <option value="KR">KR</option>
        <option value="JP">JP</option>
        <option value="OCE">OCE</option>
        <option value="BR">BR</option>
        <option value="LAN">LAN</option>
        <option value="LAS">LAS</option>
        <option value="TR">TR</option>
        <option value="RU">RU</option>
      </select>
      <input
        v-model="gameName"
        placeholder="Riot ID"
        class="flex-2 bg-surface border border-border rounded-md h-9 px-3 text-sm text-text-primary"
      />
      <input
        v-model="tagLine"
        placeholder="Tag"
        class="flex-1 bg-surface border border-border rounded-md h-9 px-3 text-sm text-text-primary"
      />
      <button
        type="submit"
        :disabled="isLoading"
        class="bg-accent text-white rounded-md h-9 px-4 text-sm font-medium cursor-pointer disabled:opacity-50"
      >
        {{ isLoading ? '...' : 'Search' }}
      </button>
    </form>

    <p v-if="errorMsg" class="text-danger text-sm text-center mb-6">
      {{ errorMsg }}
    </p>

    <div v-if="!summary && !isLoading" class="text-center py-10">
      <p class="text-text-muted text-sm">
        Search a Riot ID to see their recent matches
      </p>
    </div>

    <div v-if="summary" class="max-w-2xl mx-auto">
      <div
        v-if="getRankedEntry(summary.rankedInfo)"
        class="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3 mb-4"
      >
        <img
          :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${summary.summonerInfo.profileIconId}.png`"
          class="w-9 h-9 rounded-lg"
          alt="summoner icon"
        />
        <div>
          <p class="text-text-primary text-sm">
            {{ summary.account.gameName }}#{{ summary.account.tagLine }}
          </p>
          <p class="text-text-secondary text-xs">
            {{ getRankedEntry(summary.rankedInfo).tier }}
            {{ getRankedEntry(summary.rankedInfo).rank }} ·
            {{ getRankedEntry(summary.rankedInfo).leaguePoints }} LP
          </p>
          <p class="text-text-muted text-xs mt-0.5">
            {{ getRankedEntry(summary.rankedInfo).wins }}W
            {{ getRankedEntry(summary.rankedInfo).losses }}L ·
            {{ winRate(getRankedEntry(summary.rankedInfo)) }}% WR
          </p>
        </div>
      </div>

      <p v-else class="text-text-secondary text-sm mb-1">
        {{ summary.account.gameName }}#{{ summary.account.tagLine }}
      </p>

      <p class="text-text-muted text-xs mb-4">Recent matches</p>

      <div class="flex flex-col gap-2">
        <div
          v-for="match in summary.matches"
          :key="match.matchId"
          class="flex items-center gap-4 bg-surface border border-border rounded-lg p-3"
          :class="
            match.placement <= 4
              ? 'border-l-3 border-l-success'
              : 'border-l-3 border-l-danger'
          "
        >
          <span
            class="font-medium text-sm w-6"
            :class="match.placement <= 4 ? 'text-success' : 'text-danger'"
          >
            {{ match.placement }}
          </span>

          <div class="flex-1">
            <p class="text-text-primary text-xs mb-2">
              Level {{ match.level }} · Stage
              {{ formatStageRound(match.lastRound) }}
            </p>

            <div class="flex gap-1">
              <div
                v-for="unit in match.units"
                :key="unit.characterId"
                class="text-center"
              >
                <p class="text-accent-light text-[11px] leading-none mb-1">
                  {{ '★'.repeat(unit.tier) }}
                </p>
                <img
                  :src="championImages[unit.characterId]"
                  :alt="unit.characterId"
                  class="w-10 h-10 rounded bg-card border-2"
                  :class="costBorderClass(unit.rarity)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
