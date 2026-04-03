<template>
  <div>
    <h1 class="page-title">📊 Dashboard</h1>

    <!-- Partits en directe -->
    <div class="card" v-if="liveMatches.length > 0">
      <div class="card-title">🔴 En Directe</div>
      <div v-for="match in liveMatches" :key="match.id" class="live-match">
        <span class="team">{{ match.homeTeam.shortName }}</span>
        <span class="score live">
          {{ match.score.fullTime.home }} - {{ match.score.fullTime.away }}
        </span>
        <span class="team">{{ match.awayTeam.shortName }}</span>
      </div>
    </div>

    <!-- Resum La Liga -->
    <div class="grid-2">
      <div class="card">
        <div class="card-title">🏆 La Liga — Top 5</div>
        <p v-if="loadingLaliga" class="loading">Carregant...</p>
        <table v-else>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Equip</th>
              <th>PJ</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(team, i) in laligaTop5" :key="team.team.id">
              <td><span class="pos" :class="{ top3: i < 3 }">{{ team.position }}</span></td>
              <td>{{ team.team.shortName }}</td>
              <td>{{ team.playedGames }}</td>
              <td><strong>{{ team.points }}</strong></td>
            </tr>
          </tbody>
        </table>
        <RouterLink to="/standings" class="see-more">Veure classificació completa →</RouterLink>
      </div>

      <!-- Resum Champions -->
      <div class="card">
        <div class="card-title">⭐ Champions — Top 5</div>
        <p v-if="loadingChampions" class="loading">Carregant...</p>
        <table v-else>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Equip</th>
              <th>PJ</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(team, i) in championsTop5" :key="team.team.id">
              <td><span class="pos" :class="{ top3: i < 3 }">{{ team.position }}</span></td>
              <td>{{ team.team.shortName }}</td>
              <td>{{ team.playedGames }}</td>
              <td><strong>{{ team.points }}</strong></td>
            </tr>
          </tbody>
        </table>
        <RouterLink to="/standings" class="see-more">Veure classificació completa →</RouterLink>
      </div>
    </div>

    <!-- Pròxims partits -->
    <div class="card">
      <div class="card-title">📅 Pròxims partits — La Liga</div>
      <p v-if="loadingUpcoming" class="loading">Carregant...</p>
      <p v-else-if="upcomingMatches.length === 0" class="loading">No hi ha partits programats</p>
      <table v-else>
        <thead>
          <tr>
            <th>Data</th>
            <th>Local</th>
            <th></th>
            <th>Visitant</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="match in upcomingMatches.slice(0, 5)" :key="match.id">
            <td class="muted">{{ formatDate(match.utcDate) }}</td>
            <td>{{ match.homeTeam.shortName }}</td>
            <td class="vs">vs</td>
            <td>{{ match.awayTeam.shortName }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getStandings, getUpcomingMatches, getLiveMatches, COMPETITIONS } from '../services/football.js'

const laligaTop5 = ref([])
const championsTop5 = ref([])
const upcomingMatches = ref([])
const liveMatches = ref([])
const loadingLaliga = ref(true)
const loadingChampions = ref(true)
const loadingUpcoming = ref(true)

// Formata una data ISO a format llegible
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('ca-ES', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

// Carrega totes les dades quan el component es munta
onMounted(async () => {
  try {
    const laliga = await getStandings(COMPETITIONS.LALIGA)
    laligaTop5.value = laliga.slice(0, 5)
  } catch (e) { console.error(e) }
  finally { loadingLaliga.value = false }

  try {
    const champions = await getStandings(COMPETITIONS.CHAMPIONS)
    championsTop5.value = champions.slice(0, 5)
  } catch (e) { console.error(e) }
  finally { loadingChampions.value = false }

  try {
    upcomingMatches.value = await getUpcomingMatches(COMPETITIONS.LALIGA)
  } catch (e) { console.error(e) }
  finally { loadingUpcoming.value = false }

  try {
    liveMatches.value = await getLiveMatches()
  } catch (e) { console.error(e) }
})
</script>

<style scoped>
.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.live-match {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem;
  background: rgba(248, 113, 113, 0.1);
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.team {
  font-weight: 600;
  flex: 1;
}

.team:last-child {
  text-align: right;
}

.score {
  padding: 0.3rem 1rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 1.1rem;
  text-align: center;
  min-width: 80px;
}

.score.live {
  background: var(--red);
  color: white;
}

.muted {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.vs {
  color: var(--text-muted);
  text-align: center;
  font-size: 0.8rem;
}

.see-more {
  display: block;
  margin-top: 1rem;
  color: var(--accent);
  text-decoration: none;
  font-size: 0.85rem;
}

.see-more:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>