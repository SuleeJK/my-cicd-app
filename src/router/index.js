// Defineix les rutes de l'aplicació
// Cada ruta correspon a una pàgina del dashboard

import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import StandingsView from '../views/StandingsView.vue'
import MatchesView from '../views/MatchesView.vue'
import ScorersView from '../views/ScorersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/standings',
      name: 'standings',
      component: StandingsView
    },
    {
      path: '/matches',
      name: 'matches',
      component: MatchesView
    },
    {
      path: '/scorers',
      name: 'scorers',
      component: ScorersView
    }
  ]
})

export default router