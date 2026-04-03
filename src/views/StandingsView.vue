<template>
  <div>
    <h1 class="page-title">🏆 Classificació</h1>

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
      <p v-if="loading" class="loading">Carregant classificació...</p>
      <p v-else-if="error" class="error">{{ error }}</p>
      <table v-else>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Equip</th>
            <th>PJ</th>
            <th>G</th>
            <th>E</th>
            <th>P</th>
            <th>GF</th>
            <th>GC</th>
            <th>DG</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(team, i) in standings" :key="team.team.id">
            <td><span class="pos" :class="{ top3: i < 3 }">{{ team.position }}</span></td>
            <td class="team-name">{{ team.team.shortName }}</td>
            <td>{{ team.playedGames }}</td>
            <td>{{ team.won }}</td>
            <td>{{ team.draw }}</td>
            <td>{{ team.lost }}</td>
            <td>{{ team.goalsFor }}</td>
            <td>{{ team.goalsAgainst }}</td>
            <td :class="{ positive: team.goalDifference > 0, negative: team.goalDifference < 0 }">
              {{ team.goalDifference > 0 ? '+' : '' }}{{ team.goalDifference }}
            </td>
            <td><strong>{{ team.points }}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStandings, COMPETITIONS } from '../services/football.js'

const competitions = [
  { code: COMPETITIONS.LALIGA, name: '🇪🇸 La Liga' },
  { code: COMPETITIONS.CHAMPIONS, name: '⭐ Champions League' }
]

const selected = ref(COMPETITIONS.LALIGA)
const standings = ref([])
const loading = ref(true)
const error = ref(null)

async function selectCompetition(code) {
  selected.value = code
  loading.value = true
  error.value = null
  try {
    standings.value = await getStandings(code)
  } catch {
    error.value = 'Error carregant la classificació. Torna-ho a intentar.'
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

.team-name {
  font-weight: 600;
}

.positive { color: var(--green); }
.negative { color: var(--red); }
</style>