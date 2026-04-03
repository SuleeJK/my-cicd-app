<template>
  <div>
    <h1 class="page-title">🥇 Golejadors</h1>

    <div class="tabs">
      <button
        v-for="comp in competitions"
        :key="comp.code"
        class="tab"
        :class="{ active: selected === comp.code }"
        @click="selectCompetition(comp.code)"
      >
        {{ comp.name }}
      </button>
    </div>

    <div class="card">
      <p v-if="loading" class="loading">Carregant golejadors...</p>
      <p v-else-if="error" class="error">{{ error }}</p>
      <table v-else>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Jugador</th>
            <th>Equip</th>
            <th>Gols</th>
            <th>Assistències</th>
            <th>PJ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(scorer, i) in scorers" :key="scorer.player.id">
            <td><span class="pos" :class="{ top3: i < 3 }">{{ i + 1 }}</span></td>
            <td class="player-name">{{ scorer.player.name }}</td>
            <td class="muted">{{ scorer.team.shortName }}</td>
            <td><strong class="goals">{{ scorer.goals }}</strong></td>
            <td>{{ scorer.assists ?? '-' }}</td>
            <td class="muted">{{ scorer.playedMatches }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTopScorers, COMPETITIONS } from '../services/football.js'

const competitions = [
  { code: COMPETITIONS.LALIGA, name: '🇪🇸 La Liga' },
  { code: COMPETITIONS.CHAMPIONS, name: '⭐ Champions League' }
]

const selected = ref(COMPETITIONS.LALIGA)
const scorers = ref([])
const loading = ref(true)
const error = ref(null)

async function selectCompetition(code) {
  selected.value = code
  loading.value = true
  error.value = null
  try {
    scorers.value = await getTopScorers(code)
  } catch {
    error.value = 'Error carregant els golejadors.'
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
  margin-bottom: 1.5rem;
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

.player-name {
  font-weight: 600;
}

.goals {
  color: var(--green);
  font-size: 1rem;
}

.muted {
  color: var(--text-muted);
  font-size: 0.88rem;
}
</style>