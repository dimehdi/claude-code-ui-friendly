# UI Friendly

Makes the Claude Code terminal calmer to read without hiding anything that matters.

## Tool rows on one line

Each file edit, write, web fetch or MCP call that Claude Code draws as its own row becomes a single quiet line:

```
  ✓ Modifié hooks/register.tsx  +12 −3  ▸
  ✓ Créé README.md  +14  ▸
  ◐ $ Run the test suite  en cours…  ▸
  ✓ Ouvert https://example.com/docs  · 4,2 s  ▸
```

- **Click a row** (`▸`) to see Claude Code's full drawing of the call: the diff, the command output, the fetched page. Click again (`▾`) to fold it.
- **Errors are never folded.** A failed call keeps Claude Code's full drawing.
- **The duration shows only for slow calls** (2 seconds or more).
- **`Ctrl+O`** still shows everything in full.
- Claude's own messages between tool calls stay visible.

Runs of reads, searches and shell commands that Claude Code already folds into one line (`Read 3 files, ran 2 shell commands`) are left as they are. Subagents, questions, the task list and other plugins' rows are not touched.

Clicking needs [fullscreen rendering](https://code.claude.com/docs/en/fullscreen.md) (`/tui fullscreen`), which is how Claude Code captures the mouse.

## Themes

Three dark themes appear in `/theme`, marked as from `ui-friendly`:

| Theme | Look |
|---|---|
| **OpenCode** | Near-black background, peach accent, blue for you, orange bold text, green inline code. Modeled on the default theme of the [OpenCode](https://opencode.ai) terminal. |
| **Minimal Kiwi** | Soft charcoal background with green, cyan and orange accents, after the [Minimal Kiwi](https://marketplace.visualstudio.com/items?itemName=pranjalkumar.minimal-kiwi) VS Code theme. |
| **Vesper** | Almost monochrome, with peach and mint as the only accents, after the [Vesper](https://github.com/raunofreiberg/vesper) theme. |

## Terminal background that follows the theme

A Claude Code theme colors Claude Code's own text, not the terminal behind it. When you pick one of the three themes above, UI Friendly also sets the terminal's background, text and 16 base colors to match. Picking any other theme puts your terminal's own colors back, and so does quitting Claude Code.

This uses standard OSC color sequences. It is tested in Windows Terminal; on Windows it attaches a short PowerShell helper to Claude Code's console to write them.

## Install

```
/plugin install ui-friendly --marketplace mehdibml/claude-code-ui-friendly
```

Then run `/theme` and pick **OpenCode**, **Minimal Kiwi** or **Vesper**.

## License

MIT. The background-switching code and `hooks/paint-console.ps1` come from the Firelight skin by Garvit Nangru, see [NOTICE.md](NOTICE.md).
