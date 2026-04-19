// Detecta si estem en desenvolupament o producció
// En desenvolupament usem el proxy de Vite (/api) per evitar CORS
// En producció usem el nostre backend proxy a Railway
const BASE_URL = import.meta.env.DEV
  ? '/api'
  : 'https://football-proxy-production-8afa.up.railway.app'

import axios from 'axios'

const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY

console.log('%c⚽ Football Dashboard inicialitzat', 'color: #38bdf8; font-weight: bold; font-size: 14px')
console.log('%cEntorn:', 'color: #94a3b8', import.meta.env.DEV ? 'DEV (proxy Vite)' : 'PRODUCCIÓ (proxy Railway)')
console.log('%cBase URL:', 'color: #94a3b8', BASE_URL)

// En producció no cal la API key al frontend — la gestiona el proxy de Railway
// En local encara la necessitem per al proxy de Vite
const api = axios.create({
  baseURL: BASE_URL,
  headers: import.meta.env.DEV ? { 'X-Auth-Token': API_KEY } : {}
})

api.interceptors.request.use(config => {
  console.log(`%c→ API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, 'color: #fcd34d')
  return config
})

api.interceptors.response.use(
  response => {
    console.log(`%c✅ API Response: ${response.status} ${response.config.url}`, 'color: #4ade80')
    return response
  },
  error => {
    console.error(`%c❌ API Error: ${error.response?.status} ${error.config?.url}`, 'color: #f87171', error.message)
    return Promise.reject(error)
  }
)

export const COMPETITIONS = {
  LALIGA: 'PD',
  CHAMPIONS: 'CL'
}

// Retorna la classificació d'una competició
export async function getStandings(competitionCode) {
  console.log(`%c📊 getStandings(${competitionCode})`, 'color: #c084fc')
  const res = await api.get(`/standings/${competitionCode}`)
  console.log(`%c   → ${res.data.length} equips rebuts`, 'color: #94a3b8')
  return res.data
}

// Retorna els últims partits jugats d'una competició
export async function getRecentMatches(competitionCode) {
  console.log(`%c📅 getRecentMatches(${competitionCode})`, 'color: #c084fc')
  const res = await api.get(`/matches/${competitionCode}/recent`)
  console.log(`%c   → ${res.data.length} partits rebuts`, 'color: #94a3b8')
  return res.data
}

// Retorna els pròxims partits d'una competició
export async function getUpcomingMatches(competitionCode) {
  console.log(`%c📅 getUpcomingMatches(${competitionCode})`, 'color: #c084fc')
  const res = await api.get(`/matches/${competitionCode}/upcoming`)
  console.log(`%c   → ${res.data.length} partits rebuts`, 'color: #94a3b8')
  return res.data
}

// Retorna els partits en directe (si n'hi ha)
export async function getLiveMatches() {
  console.log('%c🔴 getLiveMatches()', 'color: #c084fc')
  const res = await api.get('/matches/live')
  console.log(`%c   → ${res.data.length} partits en directe`, 'color: #94a3b8')
  return res.data
}

// Retorna els golejadors d'una competició
export async function getTopScorers(competitionCode) {
  console.log(`%c🥇 getTopScorers(${competitionCode})`, 'color: #c084fc')
  const res = await api.get(`/scorers/${competitionCode}`)
  console.log(`%c   → ${res.data.length} golejadors rebuts`, 'color: #94a3b8')
  return res.data
}