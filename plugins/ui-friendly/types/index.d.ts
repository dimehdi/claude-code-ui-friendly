declare module 'claude-code' {
  interface PluginState {
    'ui-friendly': {
      // Durée de chaque appel d'outil terminé, en ms, par tool_use_id
      durations: Shaped<Record<string, number>>
      // Appels que la personne a dépliés d'un clic
      opened: Shaped<Record<string, true>>
    }
  }
}
