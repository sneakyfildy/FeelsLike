# FeelsLike — Requirements & Context

> Living document. Updated as the project evolves.

---

## 1. Project Overview

A simple mobile app for **personal, subjective weather tracking**, named **FeelsLike**. Each day the user can record *how the weather felt* to them — not objective sensor data, but their own perception.

---

## 2. Core Concept

| Aspect | Description |
|---|---|
| Purpose | Daily perceived-weather journal |
| Target user | Single user (personal app, no multi-user) |
| Platform | Android (primary), possibly iOS later |
| Data | Local storage only (no cloud backend, at least initially) |

---

## 3. High-Level Requirements

### Must Have
- [ ] One entry per calendar day
- [ ] Quick, simple UI — minimal taps to log the day
- [ ] User-defined "weather feel" options (e.g. icons/emoji or labels — TBD)
- [ ] View past entries (calendar or list view — TBD)

### Nice to Have (future)
- [ ] Notes/comment field per day
- [ ] Simple statistics / streaks
- [ ] Widget for home screen
- [ ] Cloud sync / backup

### Working Decision
- [x] Keep current requirements in this file
- [x] Track requirement changes in a separate Markdown changelog for traceability

---

## 4. Screen Requirements Summary

### `Today` screen
- Main landing screen and primary daily action
- Current V1 scope: choose one feeling, optionally add a note, save locally
- Full spec: [`docs/requirements/screens/today.md`](./docs/requirements/screens/today.md)

### `History` screen
- Shows past entries in reverse chronological order
- Current scope is still lightweight and can stay documented here until it grows more complex

---

## 5. UI Elements (Future Candidates)

The exact expanded UI controls are still to be defined. Candidates:
- Weather mood icons / emoji picker
- Temperature slider (perceived cold → hot)
- Condition chips (Sunny, Cloudy, Rainy, Snowy, Windy, …)
- Free-text note

---

## 6. Tech Stack Decision

> ✅ **Decided: Option A — React Native + Expo**

### Constraint
The app must be **maintainable by a Web developer** (HTML/CSS/JS skills), not a native Android/Kotlin developer.

### Chosen Stack
| Layer | Choice |
|---|---|
| Language | TypeScript |
| Framework | React Native (via Expo SDK 54) |
| Navigation | React Navigation — Bottom Tabs |
| Local storage | `@react-native-async-storage/async-storage` |
| Toolchain | Expo CLI (managed workflow) |
| Node.js | v20 LTS (managed via nvm, pinned in `.nvmrc`) |
| Entry point | `App.tsx` → bottom-tab navigator |

### Project structure
```
src/
  types/weather.ts          — TypeScript data types
  storage/weatherStorage.ts — AsyncStorage CRUD helpers
  screens/TodayScreen.tsx   — "Today" tab (main entry screen)
  screens/HistoryScreen.tsx — "History" tab (past entries list)
  components/               — Shared UI components (future)
```

See [`TECH_STACK_OPTIONS.md`](./TECH_STACK_OPTIONS.md) for the full comparison.

---

## 7. Project Status

| Date | Milestone |
|---|---|
| 2026-04-07 | Requirements gathered; tech stack options presented |
| 2026-04-07 | Tech stack decided: React Native + Expo |
| 2026-04-07 | Project bootstrapped; skeleton app with Today + History tabs running |
| 2026-04-07 | `TodayScreen` V1 scope drafted: single daily feeling + optional note |

---

## 8. Requirements Workflow

### Why Markdown is a good fit here
For this project size, Markdown requirements are beneficial because they are:
- versioned together with the code
- easy to diff in Git
- easy to update during feature work
- simple enough not to require extra tooling

### Recommended workflow
1. Keep **current truth** in this file (`REQUIREMENTS.md`)
2. Log requirement changes and decisions in `docs/requirements-changelog.md`
3. Put detailed screen specs in `docs/requirements/screens/` when a screen needs its own behavior/state rules
4. When a requirement changes, update both the current-state requirement and the changelog entry on the same branch
5. Keep entries short: what changed, why, impact on UI/data

This gives you both a clean current spec and a lightweight history of decisions.

### Current structure
- `REQUIREMENTS.md` — app-level overview and current scope
- `docs/requirements/screens/today.md` — detailed `TodayScreen` requirements
- `docs/requirements-changelog.md` — dated history of requirement changes and decisions

---

## 9. Open Questions

1. Should the V1 weather feeling selector use text pills, emoji chips, or icons?
2. Should entries be editable after the fact?
3. Local storage only, or cloud sync from day 1?
4. App name / branding?

