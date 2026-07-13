<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-bg flex items-center justify-center">
    <p class="text-text-primary">Logged in as {{ authStore.userEmail }}</p>
  </div>
</template>
