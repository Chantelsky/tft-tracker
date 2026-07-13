<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const isLoading = ref<boolean>(false)

async function handleSubmit() {
  try {
    isLoading.value = true
    if (mode.value === 'login') {
      await authStore.login(email.value, password.value)
    } else {
      await authStore.signup(email.value, password.value)
    }
    router.push('/dashboard')
  } catch (error) {
    console.error('Error during authentication:', error)
  } finally {
    isLoading.value = false
  }
}

const buttonText = computed(() => {
  if (isLoading.value) return 'Loading...'
  return mode.value === 'login' ? 'Log in' : 'Sign up'
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-bg">
    <div class="w-90 bg-surface border border-border rounded-xl p-7">
      <p class="text-center text-xs text-text-muted mb-1">Tactician's Desk</p>
      <h1 class="text-center text-lg font-medium text-text-primary mb-5">
        {{ mode === 'login' ? 'Welcome back' : 'Create an account' }}
      </h1>

      <div class="flex bg-bg rounded-md p-0.5 mb-5">
        <button
          class="flex-1 text-sm py-1.5 rounded cursor-pointer"
          :class="
            mode === 'login'
              ? 'bg-surface border border-border font-medium text-text-primary'
              : 'text-text-muted'
          "
          @click="mode = 'login'"
        >
          Log in
        </button>
        <button
          class="flex-1 text-sm py-1.5 rounded cursor-pointer"
          :class="
            mode === 'signup'
              ? 'bg-surface border border-border font-medium text-text-primary'
              : 'text-text-muted'
          "
          @click="mode = 'signup'"
        >
          Sign up
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <label class="text-sm text-text-secondary block mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="name@example.com"
          class="w-full bg-bg border border-border rounded-md h-9 px-3 mb-3.5 text-sm text-text-primary"
        />

        <label class="text-sm text-text-secondary block mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter your password"
          class="w-full bg-bg border border-border rounded-md h-9 px-3 mb-5 text-sm text-text-primary"
        />

        <button
          type="submit"
          class="w-full bg-accent text-white rounded-md h-9 text-sm font-medium cursor-pointer"
          :disabled="isLoading"
        >
          {{ buttonText }}
        </button>
      </form>
    </div>
  </div>
</template>
