# Rutas de la Aplicación

## Rutas Públicas

### Página Principal
- **/** - Index (Página de inicio)

### Torneos
- **/torneos** - Tournaments (Lista de torneos)
- **/torneo/:slug** - TournamentDetail (Detalle de un torneo específico)
- **/torneo/:slug/partidos/:id** - MatchDetailInTournament (Detalle de partido en torneo)

### Partidos
- **/partidos** - Matches (Lista de todos los partidos)
- **/partidos/:id** - MatchDetail (Detalle de un partido específico)

### Deportes
- **/deportes/:deporte** - SportMatches (Partidos por deporte)

### Calendario
- **/calendario** - Calendar (Vista de calendario)

### Noticias
- **/noticias** - News (Lista de noticias)
- **/noticia/:slug** - NewsDetail (Detalle de noticia)

### Autenticación
- **/login** - Login (Página de inicio de sesión)
- **/unauthorized** - Unauthorized (Sin permisos)

## Rutas Protegidas

### Dashboard - Usuarios
- **/dashboard/usuarios** - Users
  - **Roles permitidos:** SUPER_ADMIN, ADMINISTRADOR

### Dashboard - Configuración
- **/dashboard/configuracion** - Settings
  - **Roles permitidos:** SUPER_ADMIN

### Dashboard - Noticias (Admin)
- **/dashboard/admin/noticias** - AdminNews (Lista de noticias para admin)
  - **Roles permitidos:** SUPER_ADMIN, ADMINISTRADOR, COMITE_ORGANIZADOR
- **/dashboard/admin/noticias/crear** - AdminNewsForm (Crear noticia)
  - **Roles permitidos:** SUPER_ADMIN, ADMINISTRADOR, COMITE_ORGANIZADOR
- **/dashboard/admin/noticias/:id** - AdminNewsForm (Editar noticia)
  - **Roles permitidos:** SUPER_ADMIN, ADMINISTRADOR, COMITE_ORGANIZADOR

### Equipos
- **/equipos** - Teams (Requiere autenticación)

### Dashboard - Sin Acceso
- **/dashboard/sin-acceso** - Unauthorized

## Ruta Catch-All
- **/\*** - NotFound (404 - Página no encontrada)

---

## Arquitectura de Datos

### Servicios Activos
- **MatchService** → MockMatchRepository (usando datos mock)
- **TournamentService** → MockTournamentRepository (usando datos mock)

### Hooks de React Query Disponibles

#### Matches (Partidos)
- `useMatches()` - Todos los partidos
- `useMatch(id)` - Partido por ID
- `useLiveMatches()` - Partidos en vivo
- `useTodayMatches()` - Partidos de hoy
- `useMatchesByTournament(tournamentId)` - Partidos por torneo
- `useMatchesBySport(sport)` - Partidos por deporte
- `useMatchesByStatus(status)` - Partidos por estado
- `useUpcomingMatches(limit)` - Próximos partidos
- `useRecentResults(limit)` - Resultados recientes

#### Tournaments (Torneos)
- `useTournaments()` - Todos los torneos
- `usePublicTournaments()` - Torneos públicos
- `useTournament(id)` - Torneo por ID
- `useTournamentBySlug(slug)` - Torneo por slug
- `useActiveTournaments()` - Torneos activos

---

## Notas
- El servidor corre en **http://localhost:8080/**
- Usa **PNPM** como gestor de paquetes
- React Router con modo SPA
- React Query para gestión de estado del servidor
- Arquitectura: Services → Repositories → Mock Data
