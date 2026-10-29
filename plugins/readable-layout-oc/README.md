# Readable Layout (OpenCode restyle)

A restyled copy of [Readable Layout](https://github.com/GarvitNangru/claude-code-mods/tree/main/mods/readable-layout) by **Garvit Nangru**, released under the MIT license. All the layout work is his; this copy only changes how a few things are colored, to match the [OpenCode](https://opencode.ai) terminal look.

## What it does

Everything the original does:

- **Your messages** sit between rules labeled **You**.
- **Claude's answers** sit between rules labeled **Claude**.
- **Bold text** is drawn in color, so key words stand out.
- **Each turn ends with a rule** that shows how long it took.
- Tool activity, permission prompts, diffs and command output stay exactly as Claude Code draws them.

What this copy changes:

| | Original | This copy |
|---|---|---|
| Claude's short notes between steps | `· I'll check the config first` | `┃ I'll check the config first`, the bar running the full height of the note |
| Headings | bold | bold, in the theme's `merged` color (violet in the OpenCode theme) |
| List markers (`-`, `1.`) | default text color | the theme's `warning` color (orange in the OpenCode theme) |
| Which paragraphs the mod draws | only those that contain bold text | all of them, so headings and markers are colored everywhere |

The colors come from your Claude Code theme, so they follow whatever theme you pick. They look best with the **OpenCode** theme that ships with [UI Friendly](../ui-friendly).

## Install

```
/plugin install readable-layout-oc --marketplace mehdibml/claude-code-ui-friendly
```

**Use this copy or the original, not both.** Two layout mods would draw the same messages. If you already have the original, remove it first:

```
/plugin uninstall readable-layout@garvit-mods
```

## Settings

Run `/config` to change them, as in the original:

- **Claude text to box**: `answers` (default) boxes replies of more than a line or two and shows one-line notes behind the bar; `all` boxes everything Claude writes.
- **Bold text**: `color` (default), `highlight` (a soft background), or `off` (plain bold, and the engine draws the whole answer).

## Known trade-off

If you select a note with the mouse and copy it, the bar `┃` is copied with the text. The original avoided side marks for this reason.

## License

MIT. Original work © 2026 Garvit Nangru, see [LICENSE](LICENSE).
