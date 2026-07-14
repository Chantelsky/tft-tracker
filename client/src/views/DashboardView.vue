<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AnalyticsDashboard from '@/components/AnalyticsDashboard.vue'
import RankCard from '@/components/RankCard.vue'
import { getRankedEntry } from '@/utils/tft'

const region = ref('OCE')
const gameName = ref('')
const tagLine = ref('')
const isLoading = ref(false)
const isChecking = ref(true)
const errorMsg = ref<string | null>(null)
const linkedAccount = ref<any>(null)

async function checkLinkedAccount() {
  try {
    const res = await fetch('http://localhost:3000/api/auth/me/riot-account', {
      credentials: 'include',
    })
    const data = await res.json()
    linkedAccount.value = data
  } catch (error) {
    console.error('Failed to check linked account:', error)
  } finally {
    isChecking.value = false
  }
}

onMounted(() => {
  checkLinkedAccount()
})

async function handleLink() {
  isLoading.value = true
  errorMsg.value = null

  try {
    const res = await fetch(
      'http://localhost:3000/api/auth/link-riot-account',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          region: region.value,
          gameName: gameName.value,
          tagLine: tagLine.value,
        }),
      }
    )
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Failed to link Riot account')
    }
    await checkLinkedAccount()
  } catch (error) {
    errorMsg.value = (error as Error).message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-bg p-8">
    <AppHeader />

    <div v-if="!linkedAccount" class="text-center py-12">
      <div
        class="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-5"
      >
        <div class="w-6 h-6 rounded-md bg-accent"></div>
      </div>
      <h2 class="text-text-primary text-lg font-medium mb-1.5">
        Link your Riot account
      </h2>
      <p class="text-text-muted text-sm mb-6 max-w-sm mx-auto">
        Connect your account to see personal stats, LP trends, and per-champion
        performance.
      </p>

      <form @submit.prevent="handleLink" class="flex gap-2 max-w-md mx-auto">
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
          {{ isLoading ? '...' : 'Link' }}
        </button>
      </form>

      <p v-if="errorMsg" class="text-danger text-sm mt-4">{{ errorMsg }}</p>
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <RankCard
        v-if="getRankedEntry(linkedAccount.rankedInfo)"
        :game-name="linkedAccount.gameName"
        :tag-line="linkedAccount.tagLine"
        :profile-icon-id="linkedAccount.summonerInfo.profileIconId"
        :tier="getRankedEntry(linkedAccount.rankedInfo).tier"
        :rank="getRankedEntry(linkedAccount.rankedInfo).rank"
        :league-points="getRankedEntry(linkedAccount.rankedInfo).leaguePoints"
        :wins="getRankedEntry(linkedAccount.rankedInfo).wins"
        :losses="getRankedEntry(linkedAccount.rankedInfo).losses"
        class="mb-4"
      />
      <AnalyticsDashboard />
    </div>
  </div>
</template>
