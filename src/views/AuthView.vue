<script setup lang="ts">
import { ref } from 'vue'

const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')

function handleSubmit() {
  console.log(mode.value, email.value, password.value)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-bg">
    <div class="w-90 bg-surface border border-border rounded-xl p-7">
      <p class="text-center text-xs text-text-muted mb-1">TFT comp tracker</p>
      <h1 class="text-center text-lg font-medium text-text-primary mb-5">
        {{ mode === 'login' ? 'Welcome back' : 'Create an account' }}
      </h1>

      <div class="flex bg-bg rounded-md p-0.5 mb-5">
        <button
          class="flex-1 text-sm py-1.5 rounded"
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
          class="flex-1 text-sm py-1.5 rounded"
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
          class="w-full bg-accent text-white rounded-md h-9 text-sm font-medium"
        >
          {{ mode === 'login' ? 'Log in' : 'Sign up' }}
        </button>
      </form>
    </div>
  </div>
</template>
