// Detecta si estem en desenvolupament o producció
// En desenvolupament usem el proxy de Vite (/api) per evitar CORS
// En producció les peticions van directament a l'API
const BASE_URL = import.meta.env.DEV
  ? '/api'
  : 'https://api.football-data.org/v4'

const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY

import axios from 'axios'

// Log d'inicialització per verificar que les variables d'entorn es carreguen
console.log('%c⚽ Football Dashboard inicialitzat', 'color: #38bdf8; font-weight: bold; font-size: 14px')
console.log('%cEntorn:', 'color: #94a3b8', import.meta.env.DEV ? 'DEV (proxy Vite)' : 'PRODUCCIÓ (API directa)')
console.log('%cBase URL:', 'color: #94a3b8', BASE_URL)
console.log('%cAPI Key present:', 'color: #94a3b8', API_KEY ? '✅ Sí' : '❌ No — afegeix VITE_FOOTBALL_API_KEY al .env.local')

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'X-Auth-Token': API_KEY }
})

// Interceptor que registra cada petició a la consola
// Útil per veure quines crides s'estan fent i quan triguen
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
  const res = await api.get(`/competitions/${competitionCode}/standings`)
  console.log(`%c   → ${res.data.standings[0].table.length} equips rebuts`, 'color: #94a3b8')
  return res.data.standings[0].table
}

// Retorna els últims partits jugats d'una competició
export async function getRecentMatches(competitionCode) {
  console.log(`%c📅 getRecentMatches(${competitionCode})`, 'color: #c084fc')
  const res = await api.get(`/competitions/${competitionCode}/matches`, {
    params: { status: 'FINISHED', limit: 10 }
  })
  console.log(`%c   → ${res.data.matches.length} partits rebuts`, 'color: #94a3b8')
  return res.data.matches.reverse()
}

// Retorna els pròxims partits d'una competició
export async function getUpcomingMatches(competitionCode) {
  console.log(`%c📅 getUpcomingMatches(${competitionCode})`, 'color: #c084fc')
  const res = await api.get(`/competitions/${competitionCode}/matches`, {
    params: { status: 'SCHEDULED', limit: 10 }
  })
  console.log(`%c   → ${res.data.matches.length} partits rebuts`, 'color: #94a3b8')
  return res.data.matches
}

// Retorna els partits en directe (si n'hi ha)
export async function getLiveMatches() {
  console.log('%c🔴 getLiveMatches()', 'color: #c084fc')
  const res = await api.get('/matches', {
    params: { status: 'IN_PLAY' }
  })
  console.log(`%c   → ${res.data.matches.length} partits en directe`, 'color: #94a3b8')
  return res.data.matches
}

// Retorna els golejadors d'una competició
export async function getTopScorers(competitionCode) {
  console.log(`%c🥇 getTopScorers(${competitionCode})`, 'color: #c084fc')
  const res = await api.get(`/competitions/${competitionCode}/scorers`, {
    params: { limit: 10 }
  })
  console.log(`%c   → ${res.data.scorers.length} golejadors rebuts`, 'color: #94a3b8')
  return res.data.scorers
}