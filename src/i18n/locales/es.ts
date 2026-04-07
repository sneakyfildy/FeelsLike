const es = {
  navigation: {
    today: 'Hoy',
    history: 'Historial',
    weatherHistory: 'Historial del tiempo',
  },
  common: {
    cancel: 'Cancelar',
    delete: 'Eliminar',
  },
  languageSelector: {
    buttonLabel: 'Cambiar idioma',
    title: 'Idioma',
  },
  languages: {
    en: '🇬🇧 English',
    es: '🇪🇸 Español',
  },
  feelings: {
    cold: 'Frío',
    cool: 'Fresco',
    comfortable: 'Agradable',
    warm: 'Templado',
    hot: 'Caluroso',
  },
  today: {
    heroTitle: '¿Cómo se sintió el tiempo hoy?',
    heroSubtitle:
      'Elige la sensación que mejor describa tu día. Puedes actualizarla en cualquier momento antes de mañana.',
    feelingLabel: 'Sensación de hoy',
    noteLabel: 'Nota opcional',
    notePlaceholder:
      '¿Algo especial sobre hoy: viento seco, aire pesado, un sol inesperado...?',
    save: 'Guardar la entrada de hoy',
    saved: '✓ Guardado',
    alerts: {
      missingFeelingTitle: 'Elige una sensación',
      missingFeelingMessage: 'Selecciona cómo se sintió el tiempo hoy antes de guardar.',
      savedTitle: '¡Guardado!',
      savedMessage: 'La entrada del tiempo de hoy se ha guardado.',
    },
  },
  history: {
    emptyTitle: 'Todavía no hay entradas.',
    emptySubtitle: 'Ve a "Hoy" y guarda tu primera entrada del tiempo.',
    deleteTitle: 'Eliminar entrada',
    deleteMessage: '¿Eliminar la entrada de {{date}}?',
    feelingValue: 'Se sintió: {{feeling}}',
    feelingMissing: 'Sensación no registrada',
    noNote: 'Sin nota',
  },
} as const;

export default es;

