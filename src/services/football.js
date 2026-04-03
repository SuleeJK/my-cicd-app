// Detecta si estem en desenvolupament o producció
// En desenvolupament usem el proxy de Vite (/api) per evitar CORS
// En producció (S3 + CloudFront) les peticions van directament a l'API
const BASE_URL = import.meta.env.DEV
  ? '/api'
  : 'https://api.football-data.org/v4'

const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY

import axios from 'axios'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Auth-Token': API_KEY
  }
})

export const COMPETITIONS = {
  LALIGA: 'PD',
  CHAMPIONS: 'CL'
}

// Retorna la classificació d'una competició
export async function getStandings(competitionCode) {
  const res = await api.get(`/competitions/${competitionCode}/standings`)
  return res.data.standings[0].table
}

// Retorna els últims partits jugats d'una competició
export async function getRecentMatches(competitionCode) {
  const res = await api.get(`/competitions/${competitionCode}/matches`, {
    params: { status: 'FINISHED', limit: 10 }
  })
  return res.data.matches.reverse()
}

// Retorna els pròxims partits d'una competició
export async function getUpcomingMatches(competitionCode) {
  const res = await api.get(`/competitions/${competitionCode}/matches`, {
    params: { status: 'SCHEDULED', limit: 10 }
  })
  return res.data.matches
}

// Retorna els partits en directe (si n'hi ha)
export async function getLiveMatches() {
  const res = await api.get('/matches', {
    params: { status: 'IN_PLAY' }
  })
  return res.data.matches
}

// Retorna els golejadors d'una competició
export async function getTopScorers(competitionCode) {
  const res = await api.get(`/competitions/${competitionCode}/scorers`, {
    params: { limit: 10 }
  })
  return res.data.scorers
}