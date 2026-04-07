const en = {
  navigation: {
    today: 'Today',
    history: 'History',
    weatherHistory: 'Weather History',
  },
  common: {
    cancel: 'Cancel',
    delete: 'Delete',
  },
  feelings: {
    cold: 'Cold',
    cool: 'Cool',
    comfortable: 'Comfortable',
    warm: 'Warm',
    hot: 'Hot',
  },
  today: {
    heroTitle: 'How did the weather feel today?',
    heroSubtitle:
      'Pick the one feeling that best matches your day. You can update it anytime before tomorrow.',
    feelingLabel: "Today's feeling",
    noteLabel: 'Optional note',
    notePlaceholder:
      'Anything specific about today — dry wind, heavy air, surprising sunshine...',
    save: "Save Today's Entry",
    saved: '✓ Saved',
    alerts: {
      missingFeelingTitle: 'Pick a feeling',
      missingFeelingMessage: 'Choose how the weather felt today before saving.',
      savedTitle: 'Saved!',
      savedMessage: 'Your weather entry for today has been saved.',
    },
  },
  history: {
    emptyTitle: 'No entries yet.',
    emptySubtitle: 'Go to "Today" and save your first weather entry!',
    deleteTitle: 'Delete entry',
    deleteMessage: 'Remove the entry for {{date}}?',
    feelingValue: 'Feels like: {{feeling}}',
    feelingMissing: 'Feeling not recorded',
    noNote: 'No note',
  },
} as const;

export default en;

