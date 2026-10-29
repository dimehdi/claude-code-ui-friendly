# UI Friendly

Rend le terminal de Claude Code plus calme à lire, sans rien cacher d'important.

## Les appels d'outils sur une ligne

Chaque modification de fichier, page ouverte, recherche web ou appel MCP que Claude Code dessine sur sa propre ligne devient une seule ligne discrète :

```
  ✎ Modifié hooks/register.tsx  +12 −3  ▸
  ✎ Créé docs/README.md  +14  ▸
  ✓ Recherche web « spec-driven development »  ▸
  ✓ Ouvert https://example.com/docs  · 4,2 s  ▸
  ◐ $ Lance les tests  en cours…  ▸
```

- **Cliquez sur la flèche `▸`** au bout de la ligne pour voir l'affichage complet de Claude Code : le diff, la sortie de la commande, la page récupérée. Recliquez (`▾`) pour replier.
- **Les erreurs ne sont jamais repliées.** Un appel en échec garde l'affichage complet.
- **La durée n'apparaît que pour les appels lents** (2 secondes ou plus).
- **Un fichier s'affiche par son dossier et son nom** (`hooks/register.tsx`). Le chemin complet est dans le détail, au clic.
- **`Ctrl+O`** affiche toujours tout en détail.
- Les messages de Claude entre deux outils restent visibles.

Les lectures, recherches et commandes que Claude Code regroupe déjà en une ligne (`Read 3 files, ran 2 shell commands`) restent telles quelles. Les sous-agents, les questions, la liste de tâches et les lignes des autres plugins ne sont pas touchés.

Le clic demande le [rendu plein écran](https://code.claude.com/docs/en/fullscreen.md) (`/tui fullscreen`) : c'est lui qui permet à Claude Code de capter la souris.

## Thèmes

Trois thèmes sombres apparaissent dans `/theme`, marqués comme venant de `ui-friendly` :

| Thème | Style |
|---|---|
| **OpenCode** | Fond presque noir, accent pêche, bleu pour vous, gras en orange, code en vert. Inspiré du thème par défaut du terminal [OpenCode](https://opencode.ai). |
| **Minimal Kiwi** | Fond anthracite doux, accents vert, cyan et orange, d'après le thème VS Code [Minimal Kiwi](https://marketplace.visualstudio.com/items?itemName=pranjalkumar.minimal-kiwi). |
| **Vesper** | Presque monochrome, avec le pêche et le menthe pour seuls accents, d'après le thème [Vesper](https://github.com/raunofreiberg/vesper). |

## Un fond de terminal qui suit le thème

Un thème Claude Code colore le texte de Claude Code, pas le terminal derrière. Quand vous choisissez l'un des trois thèmes ci-dessus, UI Friendly règle aussi le fond du terminal, la couleur du texte et les 16 couleurs de base. Choisir un autre thème remet les couleurs de votre terminal, tout comme quitter Claude Code.

Le mod utilise les séquences de couleur OSC standard. Il est testé dans Windows Terminal ; sous Windows, il passe par un petit script PowerShell qui s'attache à la console de Claude Code pour les écrire. Sous macOS et Linux, il les écrit directement dans le terminal : non testé, voir la section « macOS et Linux » du [README principal](../../README.md).

## Installation

```
/plugin install ui-friendly --marketplace mehdibml/claude-code-ui-friendly
```

Lancez ensuite `/theme` et choisissez **OpenCode**, **Minimal Kiwi** ou **Vesper**.

## Licence

MIT. Le code de changement de fond et `hooks/paint-console.ps1` viennent du skin Firelight de Garvit Nangru, voir [NOTICE.md](NOTICE.md).
