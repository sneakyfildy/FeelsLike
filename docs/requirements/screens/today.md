# Today Screen Requirements

> Detailed product and interaction spec for the main landing screen.

## Purpose

The `Today` tab is the app's primary daily action. It should let the user log how today's weather felt in under 15 seconds.

Related files:
- UI: [`src/screens/TodayScreen.tsx`](../../../src/screens/TodayScreen.tsx)
- Data model: [`src/types/weather.ts`](../../../src/types/weather.ts)
- Storage: [`src/storage/weatherStorage.ts`](../../../src/storage/weatherStorage.ts)
- Localization: [`src/i18n/index.ts`](../../../src/i18n/index.ts)
- App-level requirements: [`REQUIREMENTS.md`](../../../REQUIREMENTS.md)
- Requirement history: [`docs/requirements-changelog.md`](../../requirements-changelog.md)

---

## V1 Goal

Make daily logging fast, clear, and editable for the current day.

---

## V1 Requirements

- [ ] Show today's full date clearly at the top
- [ ] Show a short prompt that explains what the user should record
- [ ] Let the user choose one primary weather feeling for today
- [ ] Allow an optional free-text note
- [ ] Save the entry locally
- [ ] If an entry already exists for today, preload it for editing
- [ ] Keep one entry per day by overwriting today's saved entry
- [ ] Give clear feedback when changes are saved

---

## V1 Interaction Model

To keep the first version fast and low-risk, the screen should use:
- a single-select "How did it feel?" choice row
- an optional note field
- one primary save action

### Recommended first feeling options
- Cold
- Cool
- Comfortable
- Warm
- Hot

These can be implemented as pills, emoji chips, or icon buttons. Start simple.

Implementation note: persisted values should remain stable IDs (`cold`, `cool`, `comfortable`, `warm`, `hot`) so labels can be localized in the UI.

---

## FeelingChip Interaction Model

Each feeling option is rendered as a `FeelingChip` pill. The chip supports two distinct gestures with different outcomes:

### Single tap
- Selects the feeling (highlights the chip with a blue background).
- Marks the form as having unsaved changes.
- The user still needs to press the sticky **Save** button at the bottom to persist.

### Long press (hold ≥ 1300 ms)
- An animated green fill sweeps across the chip from left to right over the full hold duration, giving real-time visual feedback on progress.
- When the fill reaches 100%, the chip is selected **and the entry is saved immediately** — no need to tap the Save button.
- If the user releases before the fill completes, the animation is cancelled and the fill fades back quickly (~120 ms); no selection or save occurs.
- After a successful long-press save, the fill fades out slowly (~350 ms) before the chip transitions to the selected (blue) style.

### Animation details
- **Fill animation:** `Animated.timing`, width `'0%' → '100%'`, duration `1300 ms`, easing `Easing.in(Easing.ease)` — starts slowly then accelerates, intentionally subtle so it doesn't feel mechanical.
- **Dismiss animation (early release):** `120 ms` linear fade-back.
- **Dismiss animation (post-save):** `350 ms` linear fade-back before chip turns blue.
- `useNativeDriver: false` is required because the animated property is `width` (a layout property).

### Implementation notes
- The fill is an absolutely-positioned `Animated.View` behind the chip label, hidden when the chip is already selected.
- A `longPressTriggered` ref guards against the `onPress` handler firing a second selection after a long-press save has already completed.
- Action is driven by the animation's `finished` callback rather than a separate `setTimeout`, keeping gesture logic and visual state in sync.

---

## Data Expectations

### Entry shape
`WeatherEntry` should support:
- `date` as the unique daily key
- `feeling` as the primary selection for the day
- `note` as optional free text
- `updatedAt` for save/edit tracking

### Save rules
- Saving on the same day updates the existing entry for that date
- Feeling is the primary structured field for V1
- Note remains optional

---

## UX States

### Empty / first visit today
- No feeling selected
- Empty note field
- Save action visible

### Existing entry today
- Previously saved feeling is preselected
- Previously saved note is prefilled
- User can edit and save again

### Validation state
- If the user tries to save without choosing a feeling, show clear feedback

### Saved state
- Confirm that the entry was saved successfully
- Make it obvious whether the current form is already saved or has unsaved changes

### Localization behavior
- Visible copy should come from locale resources, not inline strings in the component
- The date header should use shared locale-aware formatting helpers
- Feeling labels shown to the user should be translated from stored IDs

---

## Not in V1

- Multiple weather dimensions on the main screen
- Condition tags such as rainy / windy / cloudy
- Sliders
- Analytics / streaks
- Cloud sync

---

## Future Enhancements

- Add emoji or icons for each feeling option
- Show “last saved” time on the screen
- Add condition chips alongside the primary feeling
- Add lightweight edit history or revision notes
- Add accessibility and touch-target review once the visual design stabilizes

---

## Open Questions

1. Should the feeling selector use text pills, emoji chips, or icons?
2. Should the save button remain always visible or become sticky near the bottom?
3. Should the note field stay optional forever, or later become suggested with prompts?
4. Should the user be able to edit past days directly from `History`?

