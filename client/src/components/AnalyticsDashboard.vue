<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { useDataDragon } from '@/composables/useDataDragon'
import { costBorderClass } from '@/utils/tft'

const { championImages, traitNames } = useDataDragon()

const stats = ref({ avgPlacement: 0, top4Rate: 0, gamesTracked: 0, winRate: 0 })
const worstChampions = ref<any[]>([])
const worstTraits = ref<any[]>([])
const lpHistory = ref<{ leaguePoints: number; recordedAt: string }[]>([])
const recentMatches = ref<any[]>([])

async function fetchAnalytics() {
  const res = await fetch('http://localhost:3000/api/auth/me/analytics', {
    credentials: 'include',
  })
  const data = await res.json()

  stats.value = data.stats
  worstChampions.value = data.worstChampions
  worstTraits.value = data.worstTraits
  lpHistory.value = data.lpHistory
  recentMatches.value = data.recentMatches

  renderChart()
}

function renderChart() {
  const ctx = document.getElementById('lpChart') as HTMLCanvasElement

  const labels = lpHistory.value.map((point) =>
    new Date(point.recordedAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })
  )
  const values = lpHistory.value.map((point) => point.leaguePoints)

  const pointColors = values.map((val, i) => {
    if (i === 0) return '#7a7a8c'
    return val >= values[i - 1] ? '#2cb67d' : '#e5484d'
  })

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          data: values,
          borderColor: '#7f5af0',
          backgroundColor: 'rgba(127,90,240,0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: pointColors,
          pointBorderColor: pointColors,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: '#7a7a8c', font: { size: 10 } },
          grid: { display: false },
        },
        y: { ticks: { color: '#7a7a8c' }, grid: { color: '#1a1926' } },
      },
    },
  })
}

onMounted(() => {
  fetchAnalytics()
})
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
              traitNames[trait.name] || trait.name
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
