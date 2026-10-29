# Readable Layout (version OpenCode)

Une copie restylée de [Readable Layout](https://github.com/GarvitNangru/claude-code-mods/tree/main/mods/readable-layout) de **Garvit Nangru**, publiée sous licence MIT. Tout le travail de mise en page est le sien : cette copie change seulement quelques couleurs, pour coller au style du terminal [OpenCode](https://opencode.ai).

## Ce qu'il fait

Tout ce que fait l'original :

- **Vos messages** s'affichent entre deux traits, étiquetés **You**.
- **Les réponses de Claude** s'affichent entre deux traits, étiquetées **Claude**.
- **Le gras** est en couleur, pour que les mots importants ressortent.
- **Chaque tour se termine par un trait** qui indique sa durée.
- Les appels d'outils, les demandes de permission, les diffs et les sorties de commandes restent exactement comme Claude Code les dessine.

Ce que change cette copie :

| | Original | Cette copie |
|---|---|---|
| Les notes courtes de Claude entre deux étapes | `· Je vérifie la configuration` | `┃ Je vérifie la configuration`, la barre sur toute la hauteur de la note |
| Les titres | en gras | en gras, dans la couleur `merged` du thème (violet avec le thème OpenCode) |
| Les puces et numéros de liste | couleur du texte | couleur `warning` du thème (orange avec le thème OpenCode) |
| Les liens | couleur du texte | soulignés, dans la couleur `planMode` du thème (cyan avec le thème OpenCode) ; une adresse écrite telle quelle (`http://…`) devient aussi un lien |
| Le texte des notes | gris « dim » du terminal | un gris un peu plus clair, la couleur `inactiveShimmer` du thème |
| Un texte collé dans votre message | affiché avec les balises `<pasted_content>` | affiché sans ces balises, comme dans Claude Code de base |
| Les paragraphes dessinés par le mod | seulement ceux qui contiennent du gras | tous, pour que titres et puces soient colorés partout |

Les couleurs viennent de votre thème Claude Code : elles suivent le thème choisi. Le rendu est le meilleur avec le thème **OpenCode** fourni par [UI Friendly](../ui-friendly).

## Installation

```
/plugin install readable-layout-oc --marketplace mehdibml/claude-code-ui-friendly
```

**Utilisez cette copie ou l'original, pas les deux** : deux mods de mise en page dessineraient les mêmes messages. Si vous avez déjà l'original, retirez-le d'abord :

```
/plugin uninstall readable-layout@garvit-mods
```

## Réglages

Ils se changent avec `/config`, comme dans l'original :

- **Claude text to box** : `answers` (par défaut) encadre les réponses de plus d'une ou deux lignes et affiche les notes d'une ligne derrière la barre ; `all` encadre tout ce qu'écrit Claude.
- **Bold text** : `color` (par défaut), `highlight` (un fond léger) ou `off` (gras simple, et Claude Code dessine toute la réponse).

## Compromis connu

Si vous sélectionnez une note à la souris pour la copier, la barre `┃` est copiée avec le texte. L'original évitait les marques sur le côté pour cette raison.

## Licence

MIT. Œuvre originale © 2026 Garvit Nangru, voir [LICENSE](LICENSE).
