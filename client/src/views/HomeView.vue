<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDataDragon } from '@/composables/useDataDragon'
import AppHeader from '@/components/AppHeader.vue'
import { RouterLink, useRouter } from 'vue-router'
import { costBorderClass, formatStageRound, getRankedEntry } from '@/utils/tft'
import RankCard from '@/components/RankCard.vue'

const props = defineProps<{
  region?: string
  gameName?: string
  tagLine?: string
}>()

const router = useRouter()
const { championImages } = useDataDragon()

const region = ref(props.region || 'OCE')
const gameName = ref(props.gameName || '')
const tagLine = ref(props.tagLine || '')
const isLoading = ref(false)
const errorMsg = ref<string | null>(null)
const summary = ref<any>(null)

async function fetchSummary() {
  isLoading.value = true
  errorMsg.value = null
  summary.value = null

  try {
    const res = await fetch(
      `http://localhost:3000/api/summary/${props.region}/${props.gameName}/${props.tagLine}?count=5`
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

watch(
  () => props.gameName,
  () => {
    if (props.gameName && props.tagLine && props.region) {
      fetchSummary()
    }
  },
  { immediate: true }
)

function handleSearch() {
  router.push(`/search/${region.value}/${gameName.value}/${tagLine.value}`)
}
</script>

<template>
  <div class="min-h-screen bg-bg p-8">
    <AppHeader />
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

    <div v-if="isLoading" class="flex justify-center py-10">
      <div
        class="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin"
      ></div>
    </div>

    <div v-if="summary" class="max-w-4xl mx-auto">
      <RankCard
        v-if="getRankedEntry(summary.rankedInfo)"
        :game-name="summary.account.gameName"
        :tag-line="summary.account.tagLine"
        :profile-icon-id="summary.summonerInfo.profileIconId"
        :tier="getRankedEntry(summary.rankedInfo).tier"
        :rank="getRankedEntry(summary.rankedInfo).rank"
        :league-points="getRankedEntry(summary.rankedInfo).leaguePoints"
        :wins="getRankedEntry(summary.rankedInfo).wins"
        :losses="getRankedEntry(summary.rankedInfo).losses"
        class="mb-4"
      />

      <p v-else class="text-text-secondary text-sm mb-1">
        {{ summary.account.gameName }}#{{ summary.account.tagLine }}
      </p>

      <p class="text-text-muted text-xs mb-4">Recent matches</p>

      <div class="flex flex-col gap-2">
        <RouterLink
          v-for="match in summary.matches"
          :key="match.matchId"
          :to="`/match/${region}/${match.matchId}`"
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
              <span class="text-text-muted text-xs ml-auto">View match →</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
