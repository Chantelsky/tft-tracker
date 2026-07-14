import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import DashboardView from '../views/DashboardView.vue'
import { useAuthStore } from '../stores/auth'
import MatchDetailView from '../views/MatchDetailView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    {
      path: '/search/:region/:gameName/:tagLine',
      component: HomeView,
      props: true,
    },
    { path: '/login', component: AuthView },
    {
      path: '/match/:region/:matchId',
      component: MatchDetailView,
      props: true,
    },
    {
      path: '/dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to, _from) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthChecked) {
    await authStore.checkAuth()
  }

  if (to.meta.requiresAuth && !authStore.userId) {
    return '/login'
  }
})

export default router
