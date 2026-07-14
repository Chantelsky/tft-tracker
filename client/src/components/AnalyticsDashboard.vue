<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { useDataDragon } from '@/composables/useDataDragon'
import { costBorderClass } from '@/utils/tft'

const { championImages } = useDataDragon()

// Mock data — replace with real API calls tomorrow
const stats = ref({
  avgPlacement: 4.2,
  top4Rate: 55,
  gamesTracked: 42,
  winRate: 10,
})

const worstChampions = ref([
  { characterId: 'TFT17_Zed', top4Rate: 32 },
  { characterId: 'TFT17_Riven', top4Rate: 39 },
  { characterId: 'TFT17_Karma', top4Rate: 46 },
])

const worstTraits = ref([
  { name: 'Dark Star', top4Rate: 41 },
  { name: 'Stargazer', top4Rate: 48 },
  { name: 'Astronaut', top4Rate: 52 },
])

const lpHistory = ref([
  800, 780, 820, 810, 860, 840, 880, 900, 870, 920, 950, 930, 970, 1000, 980,
  1020, 1050, 1030, 1070, 1100,
])

onMounted(() => {
  const ctx = document.getElementById('lpChart') as HTMLCanvasElement
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: lpHistory.value.map((_, i) => i + 1),
      datasets: [
        {
          data: lpHistory.value,
          borderColor: '#7f5af0',
          backgroundColor: 'rgba(127,90,240,0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { ticks: { color: '#7a7a8c' }, grid: { color: '#1a1926' } },
      },
    },
  })
})

//placeholder for recent matches, will be replaced with real data from API
const recentMatches = ref([
  {
    matchId: 'OC1_1',
    placement: 3,
    level: 9,
    units: [
      { characterId: 'TFT17_Shen', tier: 2, rarity: 2 },
      { characterId: 'TFT17_Jhin', tier: 1, rarity: 4 },
      { characterId: 'TFT17_Nunu', tier: 2, rarity: 4 },
    ],
  },
  {
    matchId: 'OC1_2',
    placement: 1,
    level: 9,
    units: [
      { characterId: 'TFT17_Jhin', tier: 3, rarity: 4 },
      { characterId: 'TFT17_Karma', tier: 2, rarity: 4 },
    ],
  },
  {
    matchId: 'OC1_3',
    placement: 6,
    level: 8,
    units: [{ characterId: 'TFT17_Zed', tier: 1, rarity: 0 }],
  },
])
</script>

<template>
  <div>
    <div class="grid grid-cols-4 gap-3 mb-6">
      <div class="bg-surface rounded-lg p-3">
        <p class="text-text-muted text-xs mb-1">Avg placement</p>
        <p class="text-text-primary text-xl">{{ stats.avgPlacement }}</p>
      </div>
      <div class="bg-surface rounded-lg p-3">
        <p class="text-text-muted text-xs mb-1">Top 4 rate</p>
        <p class="text-success text-xl">{{ stats.top4Rate }}%</p>
      </div>
      <div class="bg-surface rounded-lg p-3">
        <p class="text-text-muted text-xs mb-1">Games tracked</p>
        <p class="text-text-primary text-xl">{{ stats.gamesTracked }}</p>
      </div>
      <div class="bg-surface rounded-lg p-3">
        <p class="text-text-muted text-xs mb-1">Win rate</p>
        <p class="text-danger text-xl">{{ stats.winRate }}%</p>
      </div>
    </div>

    <p class="text-text-secondary text-sm mb-2">LP over time</p>
    <div class="relative h-40 mb-8">
      <canvas id="lpChart"></canvas>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <div>
        <p class="text-text-secondary text-sm mb-3">
          Worst performing champions
        </p>
        <div class="flex flex-col gap-2">
          <div
            v-for="champ in worstChampions"
            :key="champ.characterId"
            class="flex items-center gap-2"
          >
            <span class="text-text-secondary text-xs w-24 truncate">{{
              champ.characterId.replace('TFT17_', '')
            }}</span>
            <div class="flex-1 bg-card rounded h-2">
              <div
                class="bg-danger h-2 rounded"
                :style="{ width: champ.top4Rate + '%' }"
              ></div>
            </div>
            <span class="text-danger text-xs w-10 text-right"
              >{{ champ.top4Rate }}%</span
            >
          </div>
        </div>
      </div>

      <div>
        <p class="text-text-secondary text-sm mb-3">Worst performing traits</p>
        <div class="flex flex-col gap-2">
          <div
            v-for="trait in worstTraits"
            :key="trait.name"
            class="flex items-center gap-2"
          >
            <span class="text-text-secondary text-xs w-24 truncate">{{
              trait.name
            }}</span>
            <div class="flex-1 bg-card rounded h-2">
              <div
                class="bg-accent h-2 rounded"
                :style="{ width: trait.top4Rate + '%' }"
              ></div>
            </div>
            <span class="text-accent-light text-xs w-10 text-right"
              >{{ trait.top4Rate }}%</span
            >
          </div>
        </div>
      </div>
    </div>

    <p class="text-text-secondary text-sm mt-8 mb-3">Recent matches</p>
    <div class="flex flex-col gap-2">
      <div
        v-for="match in recentMatches"
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
          <p class="text-text-primary text-xs mb-2">Level {{ match.level }}</p>
          <div class="flex gap-1">
            <div
              v-for="unit in match.units"
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
        </div>
      </div>
    </div>
  </div>
</template>
