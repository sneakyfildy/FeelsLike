# Requirements Changelog

> Purpose: keep a lightweight history of requirement changes and product decisions.

## 2026-04-07

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

### Decision
- Use Markdown files to track requirements and requirement changes for now.
- Use a hybrid doc structure:
  - app-level summary in `REQUIREMENTS.md`
  - screen-level detail in `docs/requirements/screens/`
  - dated history in `docs/requirements-changelog.md`

### Why
- The project is small and evolving quickly.
- Keeping requirements in-repo makes them easy to update alongside code changes.
- Git already gives version history, and this changelog adds human-readable intent.

### Impact on implementation
- `TodayScreen` can now move from placeholder UI toward a concrete V1 interaction model.
- `WeatherEntry` will likely need one new required or semi-structured field for the primary daily feeling in the next implementation step.
- Screen-specific product work can expand without turning `REQUIREMENTS.md` into one long file.

