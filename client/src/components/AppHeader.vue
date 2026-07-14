<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const showDropdown = ref(false)

async function handleSignOut() {
  await authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="flex items-center justify-between mb-10 relative">
    <RouterLink to="/" class="flex items-center gap-2">
      <div class="w-6 h-6 rounded-md bg-accent"></div>
      <span class="text-text-primary font-medium text-sm"
        >Tactician's Desk</span
      >
    </RouterLink>

    <div class="flex items-center gap-5">
      <RouterLink
        to="/"
        class="text-text-secondary text-sm hover:text-text-primary"
      >
        Search
      </RouterLink>

      <RouterLink
        v-if="!authStore.userId"
        to="/login"
        class="bg-accent text-white text-sm font-medium px-4 py-2 rounded-md cursor-pointer"
      >
        Log in
      </RouterLink>
      <div v-else class="relative">
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
          <RouterLink
            to="/dashboard"
            class="block w-full text-left text-text-primary text-sm px-2.5 py-1.5 rounded hover:bg-bg cursor-pointer"
          >
            Dashboard
          </RouterLink>
          <button
            @click="handleSignOut"
            class="w-full text-left text-danger text-sm px-2.5 py-1.5 rounded hover:bg-bg cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
