import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const userEmail = ref<string | null>(null)
  const error = ref<string | null>(null)

  async function signup(email: string, password: string) {
    error.value = null
    const res = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      error.value = data.error
      throw new Error(data.error)
    }
    userEmail.value = data.user.email
  }

  async function login(email: string, password: string) {
    error.value = null
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      error.value = data.error
      throw new Error(data.error)
    }
    userEmail.value = data.user.email
  }

  async function checkAuth() {
    const res = await fetch('http://localhost:3000/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    })

    if (!res.ok) {
      return
    }

    const data = await res.json()
    userEmail.value = data.email
  }

  return { userEmail, error, signup, login, checkAuth }
})
