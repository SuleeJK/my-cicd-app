<template>
  <div class="app">
    <nav class="navbar">
      <div class="navbar-brand">
        <span class="logo">⚽</span>
        <span class="title">Football Dashboard</span>
      </div>
      <div class="navbar-links">
        <RouterLink to="/">Inici</RouterLink>
        <RouterLink to="/standings">Classificació</RouterLink>
        <RouterLink to="/matches">Partits</RouterLink>
        <RouterLink to="/scorers">Golejadors</RouterLink>
      </div>
    </nav>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg: #0f172a;
  --bg-card: #1e293b;
  --border: #334155;
  --accent: #38bdf8;
  --green: #4ade80;
  --yellow: #fcd34d;
  --red: #f87171;
  --text: #f1f5f9;
  --text-muted: #94a3b8;
}

html, body {
  /* Ocupa tota l'alçada de la pantalla */
  height: 100%;
  width: 100%;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Segoe UI', sans-serif;
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navbar ocupa tot l'ample */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 3rem;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo { font-size: 1.5rem; }

.title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent);
}

.navbar-links {
  display: flex;
  gap: 2rem;
}

.navbar-links a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.navbar-links a:hover,
.navbar-links a.router-link-active {
  color: var(--accent);
}

/* Contingut principal — ocupa tot l'ample disponible */
.content {
  flex: 1;
  width: 100%;
  /* Marges laterals petits per aprofitar l'espai */
  padding: 2rem 3rem;
}

/* Cards */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Taules */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th {
  text-align: left;
  padding: 0.6rem 0.8rem;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 0.7rem 0.8rem;
  border-bottom: 1px solid var(--border);
}

tr:last-child td { border-bottom: none; }
tr:hover td { background: rgba(255,255,255,0.03); }

.loading {
  text-align: center;
  color: var(--text-muted);
  padding: 3rem;
  font-size: 0.95rem;
}

.error {
  text-align: center;
  color: var(--red);
  padding: 2rem;
  font-size: 0.95rem;
}

.pos {
  font-weight: 700;
  color: var(--text-muted);
  width: 2rem;
  display: inline-block;
  text-align: center;
}

.pos.top3 { color: var(--yellow); }

/* Responsive */
@media (max-width: 768px) {
  .navbar { padding: 1rem; }
  .content { padding: 1rem; }
}
</style>