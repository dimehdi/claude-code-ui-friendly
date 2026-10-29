# Claude Code UI Friendly

Un terminal Claude Code plus calme, dans le style d'[OpenCode](https://opencode.ai). Chaque appel d'outil tient sur une ligne discrète, les notes de Claude s'affichent derrière une fine barre, les titres et les listes prennent de la couleur, et le fond du terminal suit le thème que vous choisissez.

[![Licence : MIT](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENSE)
![Claude Code 2.1.312+](https://img.shields.io/badge/Claude%20Code-2.1.312%2B-d97757)
![Testé sur Windows Terminal](https://img.shields.io/badge/test%C3%A9%20sur-Windows%20Terminal-4d4d4d)
![macOS et Linux : non testé](https://img.shields.io/badge/macOS%20%2F%20Linux-non%20test%C3%A9-lightgrey)

## Avant / après

La même conversation, affichée deux fois : Claude crée une liste de courses, la modifie, fait une recherche web, puis résume.

**Avant**, Claude Code de base (thème Dark mode, sans plugin) :

![Claude Code de base : le message, les notes de Claude, les outils et la réponse commencent tous par le même point blanc ; la création du fichier affiche tout son contenu, la modification affiche le diff complet en rouge et vert, et la recherche web prend deux lignes](docs/screenshots/before.png)

**Après**, avec `ui-friendly`, `readable-layout-oc` et le thème OpenCode :

![La même conversation avec les plugins : le message est encadré « You », chaque note de Claude est grise derrière une barre verticale, la création et la modification du fichier tiennent chacune sur une ligne avec leurs lignes ajoutées et retirées, la recherche web tient sur une ligne, et la réponse est encadrée « Claude » avec un titre violet, des tirets orange et un lien cyan](docs/screenshots/after.png)

| Dans la capture | Avant | Après |
|---|---|---|
| Votre message | bloc gris | encadré **You** |
| Les notes de Claude (« Je crée le fichier… ») | même point blanc que tout le reste | gris discret, derrière une barre `┃` |
| La création du fichier | tout le contenu du fichier, 7 lignes | `✎ Créé courses.md  +6  ▸` |
| La modification | le diff complet, 9 lignes | `✎ Modifié courses.md  +2 −1  ▸`, le diff à un clic sur `▸` |
| La recherche web | deux lignes | une ligne |
| La réponse | texte après un point blanc | encadrée **Claude**, titre violet, tirets orange, lien cyan |
| La fin du tour | rien | un trait avec la durée du tour |

La réflexion de Claude (le « thinking ») n'apparaît pas dans ces captures : Claude Code la replie lui-même, et aucun plugin ne peut la redessiner.

## Contenu

Ce dépôt est une marketplace de plugins Claude Code qui en contient deux. Installez l'un, l'autre, ou les deux.

| Plugin | Rôle |
|---|---|
| [**ui-friendly**](plugins/ui-friendly) | Les appels d'outils sur une ligne, le détail au clic, les erreurs toujours dépliées. Trois thèmes sombres (OpenCode, Minimal Kiwi, Vesper). Un fond de terminal qui change avec le thème. |
| [**readable-layout-oc**](plugins/readable-layout-oc) | [Readable Layout](https://github.com/GarvitNangru/claude-code-mods/tree/main/mods/readable-layout) de Garvit Nangru, restylé : vos messages et ceux de Claude encadrés et étiquetés, les notes derrière une barre `┃`, les titres en violet, les puces en orange. |

Pour une barre de progression et un panneau des sous-agents, ajoutez [Agent Monitor](https://github.com/GarvitNangru/claude-code-mods/tree/main/mods/agent-monitor), lui aussi de Garvit Nangru. Il fonctionne avec les deux plugins.

## Prérequis

- **Claude Code 2.1.312 ou plus récent.** Les deux plugins sont des mods : ils utilisent l'API de hooks de Claude Code, encore en accès anticipé et susceptible de changer d'une version à l'autre. Vérifiez votre version avec `claude --version`.
- **Le rendu plein écran** pour déplier un appel d'un clic : lancez `/tui fullscreen` une fois. Tout le reste fonctionne aussi avec le rendu classique.
- **Un terminal en couleurs 24 bits.** Testé dans Windows Terminal sous Windows 11. Les autres terminaux qui gèrent les séquences de couleur OSC (iTerm2, WezTerm, Ghostty, kitty…) devraient fonctionner, mais n'ont pas été testés.

## Installation rapide

Dans Claude Code :

```
/plugin install ui-friendly --marketplace mehdibml/claude-code-ui-friendly
/plugin install readable-layout-oc --marketplace mehdibml/claude-code-ui-friendly
```

Répondez `y` quand Claude Code propose d'ajouter la marketplace, puis choisissez la portée **user** pour que les plugins se chargent dans toutes vos sessions. Ils fonctionnent tout de suite, sans redémarrage.

Choisissez ensuite un thème :

```
/theme
```

Prenez **OpenCode**, **Minimal Kiwi** ou **Vesper**, marqués comme venant de `ui-friendly`.

> **Vous utilisez déjà le Readable Layout d'origine ?** Gardez l'un ou l'autre, pas les deux : deux mods de mise en page dessineraient les mêmes messages. Retirez d'abord l'original avec `/plugin uninstall readable-layout@garvit-mods`.

Depuis un terminal plutôt que depuis Claude Code :

```
claude plugin install ui-friendly --marketplace mehdibml/claude-code-ui-friendly
claude plugin install readable-layout-oc --marketplace mehdibml/claude-code-ui-friendly
```

Dans l'application desktop de Claude, où `/plugin` ne fonctionne pas : cliquez sur **+** à côté de la zone de saisie, puis **Plugins**, **Add marketplace** avec `mehdibml/claude-code-ui-friendly`, puis **Add plugin**.

## Ce qui change

| | Claude Code de base | Avec les deux plugins |
|---|---|---|
| Une modification de fichier | Une ligne d'en-tête puis le diff complet | `✎ Modifié hooks/app.ts  +12 −3  ▸`, le diff à un clic |
| Une recherche web, une page ouverte | Deux lignes par appel | `✓ Recherche web « … »  ▸` |
| Un appel en erreur | Sortie complète | Sortie complète (jamais repliée) |
| Votre message | `> corrige le bug de connexion` | Entre deux traits, étiqueté **You** |
| La réponse de Claude | Du texte après une puce | Entre deux traits, étiquetée **Claude**, avec titres, puces et gras en couleur |
| Les notes courtes de Claude | Même style que la réponse | `┃ Je vérifie la configuration`, en gris discret |
| La fin d'un tour | Une ligne d'indicateur | Un trait avec la durée du tour |

Les lectures, recherches et commandes que Claude Code regroupe déjà en une ligne (`Read 3 files, ran 2 shell commands`) restent telles quelles.

## Configurer Windows Terminal (facultatif)

UI Friendly repeint déjà le fond du terminal pendant que Claude Code tourne. Pour retrouver les mêmes couleurs dans un onglet **Claude Code** dédié, ajoutez les fichiers de [`windows-terminal/`](windows-terminal) aux réglages de Windows Terminal (**Paramètres** → **Ouvrir le fichier JSON**) :

1. Copiez les trois entrées de [`schemes.json`](windows-terminal/schemes.json) dans la liste `"schemes"`.
2. Copiez [`profile.json`](windows-terminal/profile.json) dans `"profiles"` → `"list"`. Ce profil ouvre directement Claude Code, avec les couleurs OpenCode et un peu de marge autour du texte.

Gardez une police **à chasse fixe** comme Cascadia Mono, celle de Windows Terminal par défaut. Un terminal dessine chaque caractère dans une case de largeur fixe : une police proportionnelle comme Arial s'y affiche avec des espacements irréguliers.

## macOS et Linux

Les plugins ont été développés et testés sous Windows. Voici ce qui change ailleurs :

| Partie | macOS / Linux |
|---|---|
| Appels d'outils sur une ligne, détail au clic | Fonctionne : tout se passe dans Claude Code. Le clic demande le rendu plein écran (`/tui fullscreen`) ; dans iTerm2, activez aussi **Settings → Profiles → Terminal → Enable mouse reporting**. |
| Thèmes OpenCode, Minimal Kiwi, Vesper | Fonctionnent : ce sont des fichiers de couleurs lus par Claude Code. |
| `readable-layout-oc` | Fonctionne : tout se passe dans Claude Code. |
| Fond du terminal qui suit le thème | **Non testé.** Le mod écrit les couleurs directement dans le terminal. iTerm2, Ghostty, WezTerm et kitty acceptent ces séquences ; le Terminal d'Apple les ignore, et le fond reste alors tel quel, sans autre effet. |

Pour avoir les couleurs du thème en permanence, et pas seulement pendant que Claude Code tourne, importez le fichier de votre terminal :

- **iTerm2** : **Settings → Profiles → Colors → Color Presets… → Import…**, choisissez un fichier de [`iterm2/`](iterm2), puis sélectionnez le preset dans la même liste.
- **Ghostty** : copiez un fichier de [`ghostty/`](ghostty) dans `~/.config/ghostty/themes/`, puis ajoutez `theme = OpenCode` (ou `Minimal Kiwi`, `Vesper`) à `~/.config/ghostty/config`.
- **Autres terminaux** : les couleurs exactes sont dans [`windows-terminal/schemes.json`](windows-terminal/schemes.json) (fond, texte, curseur et les 16 couleurs de base).

Côté police, gardez une police à chasse fixe : SF Mono ou Menlo sur Mac, la police par défaut de votre terminal sous Linux.

## Mettre à jour et désinstaller

```
claude plugin update ui-friendly@ui-friendly
claude plugin update readable-layout-oc@ui-friendly
```

Lancez ensuite `/reload-plugins` dans les sessions ouvertes.

```
/plugin uninstall ui-friendly@ui-friendly
/plugin uninstall readable-layout-oc@ui-friendly
```

## Dépannage

| Symptôme | Solution |
|---|---|
| Cliquer sur la flèche `▸` d'une ligne d'outil ne fait rien | Activez le rendu plein écran avec `/tui fullscreen`. Dans iTerm2, activez aussi **Settings → Profiles → Terminal → Enable mouse reporting**. |
| Le fond ne change pas avec le thème | Seuls les trois thèmes de UI Friendly repeignent le fond. Vérifiez que votre terminal gère les séquences OSC 10 et 11. |
| Les messages s'affichent en double, ou alternent entre deux styles | Deux mods de mise en page sont installés. Gardez `readable-layout-oc` ou `readable-layout`, pas les deux. |
| Un plugin ne marche plus après une mise à jour de Claude Code | L'API des mods est en accès anticipé. Mettez les plugins à jour, et [ouvrez une issue](https://github.com/mehdibml/claude-code-ui-friendly/issues) si le problème persiste. |

## Développement

Chaque plugin se valide et se teste avec la ligne de commande de Claude Code :

```
claude plugin validate plugins/ui-friendly
claude plugin test plugins/ui-friendly
claude plugin validate plugins/readable-layout-oc
claude plugin test plugins/readable-layout-oc
```

Pour charger une copie de travail dans toutes vos sessions, indiquez son dossier dans `CLAUDE_CODE_PLUGIN_DIRS`, dans le bloc `env` de `~/.claude/settings.json` (chemins séparés par `;` sous Windows, `:` ailleurs). Claude Code recharge un mod à chaque enregistrement de ses fichiers.

## Crédits

- **[Garvit Nangru](https://github.com/GarvitNangru)** a écrit [Readable Layout](https://github.com/GarvitNangru/claude-code-mods/tree/main/mods/readable-layout), sur lequel repose `readable-layout-oc`, ainsi que le code de changement de fond du skin [Firelight](https://github.com/GarvitNangru/claude-code-mods/tree/main/skins/firelight), qu'adapte UI Friendly. Les deux sont sous licence MIT.
- Les thèmes sont des palettes inspirées du thème par défaut d'[OpenCode](https://opencode.ai), du thème VS Code [Minimal Kiwi](https://marketplace.visualstudio.com/items?itemName=pranjalkumar.minimal-kiwi) de Pranjal Kumar et de [Vesper](https://github.com/raunofreiberg/vesper) de Rauno Freiberg.

Ce projet n'est affilié ni à Anthropic ni à OpenCode.

## Licence

[MIT](LICENSE). Les parties tierces gardent leurs propres mentions : [`plugins/readable-layout-oc/LICENSE`](plugins/readable-layout-oc/LICENSE) et [`plugins/ui-friendly/NOTICE.md`](plugins/ui-friendly/NOTICE.md).
