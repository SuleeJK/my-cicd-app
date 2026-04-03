<template>
  <div>
    <h1 class="page-title">⚽ Partits</h1>

    <div class="tabs">
      <button class="tab" :class="{ active: view === 'recent' }" @click="view = 'recent'">
        Resultats recents
      </button>
      <button class="tab" :class="{ active: view === 'upcoming' }" @click="view = 'upcoming'">
        Pròxims partits
      </button>
    </div>

    <div class="tabs small">
      <button
        v-for="comp in competitions"
        :key="comp.code"
        class="tab small"
        :class="{ active: selected === comp.code }"
        @click="selectCompetition(comp.code)"
      >
        {{ comp.name }}
      </button>
    </div>

    <p v-if="loading" class="loading">Carregant partits...</p>
    <p v-else-if="error" class="error">{{ error }}</p>

    <div v-else>
      <div
        v-for="match in currentMatches"
        :key="match.id"
        class="match-card"
      >
        <div class="match-date">{{ formatDate(match.utcDate) }}</div>
        <div class="match-row">
          <span class="team home">{{ match.homeTeam.shortName }}</span>
          <span class="score-box" :class="scoreClass(match)">
            <template v-if="view === 'recent'">
              {{ match.score.fullTime.home }} - {{ match.score.fullTime.away }}
            </template>
            <template v-else>
              vs
            </template>
          </span>
          <span class="team away">{{ match.awayTeam.shortName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getRecentMatches, getUpcomingMatches, COMPETITIONS } from '../services/football.js'

const competitions = [
  { code: COMPETITIONS.LALIGA, name: '🇪🇸 La Liga' },
  { code: COMPETITIONS.CHAMPIONS, name: '⭐ Champions' }
]

const selected = ref(COMPETITIONS.LALIGA)
const view = ref('recent')
const recentMatches = ref([])
const upcomingMatches = ref([])
const loading = ref(true)
const error = ref(null)

const currentMatches = computed(() =>
  view.value === 'recent' ? recentMatches.value : upcomingMatches.value
)

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('ca-ES', {
    weekday: 'long', day: 'numeric', month: 'long',
    hour: '2-digit', minute: '2-digit'
  })
}

function scoreClass(match) {
  if (view.value !== 'recent') return 'neutral'
  const h = match.score.fullTime.home
  const a = match.score.fullTime.away
  if (h > a) return 'home-win'
  if (h < a) return 'away-win'
  return 'draw'
}

async function selectCompetition(code) {
  selected.value = code
  loading.value = true
  error.value = null
  try {
    recentMatches.value = await getRecentMatches(code)
    upcomingMatches.value = await getUpcomingMatches(code)
  } catch {
    error.value = 'Error carregant els partits.'
  } finally {
    loading.value = false
  }
}

onMounted(() => selectCompetition(COMPETITIONS.LALIGA))
</script>

<style scoped>
.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tab {
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.tab.active,
.tab:hover {
  background: var(--accent);
  color: var(--bg);
  border-color: var(--accent);
  font-weight: 600;
}

.tab.small {
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
}

.match-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1rem 1.5rem;
  margin-bottom: 0.8rem;
}

.match-date {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}

.match-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.team {
  font-weight: 600;
  font-size: 1rem;
  flex: 1;
}

.team.away {
  text-align: right;
}

.score-box {
  padding: 0.3rem 1.2rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 1rem;
  text-align: center;
  min-width: 80px;
}

.home-win { background: rgba(74, 222, 128, 0.15); color: var(--green); }
.away-win { background: rgba(248, 113, 113, 0.15); color: var(--red); }
.draw { background: rgba(252, 211, 77, 0.15); color: var(--yellow); }
.neutral { background: var(--border); color: var(--text-muted); }
</style>