# Requirements Changelog

> Purpose: keep a lightweight history of requirement changes and product decisions.

## 2026-04-07 — FeelingChip animated interaction

### Added
- Implemented `FeelingChip` as a standalone component inside `TodayScreen`.
- **Single tap** selects the feeling and marks the form dirty (unsaved). The sticky Save button at the bottom must still be pressed to persist.
- **Long press** (hold for 1300 ms) selects the feeling **and saves immediately**, bypassing the Save button.
- An animated green fill sweeps left-to-right across the chip during the hold, giving progress feedback. Releasing early cancels the fill and reverts it; releasing after completion saves and transitions the chip to its selected (blue) style.
- Fill easing uses `Easing.in(Easing.ease)` — starts slow, then accelerates — intentionally subtle.
- A `longPressTriggered` ref prevents the `onPress` handler from double-firing after a long-press save.
- Updated `docs/requirements/screens/today.md` with a full **FeelingChip Interaction Model** section covering gestures, animation details, and implementation notes.

### Decision
- Driving the long-press action from the animation's `finished` callback (rather than a `setTimeout`) keeps gesture and visual state in sync without a second timer.
- `useNativeDriver: false` is required for the width-based fill animation.

### Why
- A long-press shortcut lets users who know their feeling log it with a single gesture — faster than tap + scroll to Save.
- The fill animation makes the hold feel purposeful and gives confidence that something is happening without being distracting.

### Impact on implementation
- `FeelingChip` encapsulates all gesture and animation logic; `TodayScreen` only passes `onSelect` and `onSaveWithFeeling` callbacks.
- No data model changes — the entry shape and save logic are unchanged.

---

### Added
- Defined `TodayScreen` as the main landing screen and primary daily action.
- Drafted `TodayScreen` V1 scope:
  - show today's date
  - choose one primary weather feeling
  - optional note
  - save locally
  - preload and edit today's existing entry
  - keep one entry per calendar day
- Added a requirements workflow:
  - `REQUIREMENTS.md` stores current truth
  - `docs/requirements-changelog.md` stores dated changes
- Added a dedicated screen spec file:
  - `docs/requirements/screens/today.md` stores detailed `TodayScreen` requirements
- Added app localization context:
  - `expo-localization` + `i18next` + `react-i18next`
  - English default / fallback
  - Spanish locale resources prepared
  - persisted language override via AsyncStorage
  - shared header language selector

### Decision
- Use Markdown files to track requirements and requirement changes for now.
- Use a hybrid doc structure:
  - app-level summary in `REQUIREMENTS.md`
  - screen-level detail in `docs/requirements/screens/`
  - dated history in `docs/requirements-changelog.md`
- Keep i18n architecture documented in-repo so future UI work preserves translation keys, locale-aware dates, and language-neutral stored values.

### Why
- The project is small and evolving quickly.
- Keeping requirements in-repo makes them easy to update alongside code changes.
- Git already gives version history, and this changelog adds human-readable intent.

### Impact on implementation
- `TodayScreen` can now move from placeholder UI toward a concrete V1 interaction model.
- `WeatherEntry` will likely need one new required or semi-structured field for the primary daily feeling in the next implementation step.
- Screen-specific product work can expand without turning `REQUIREMENTS.md` into one long file.
- Localization work now has explicit context: where language is resolved, where locale resources live, and how language selection is persisted.

