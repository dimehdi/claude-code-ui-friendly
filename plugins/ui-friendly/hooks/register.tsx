import { atom, read, update } from 'claude-code'
import type { EngineInterface as Engine, Register, Timer } from 'claude-code'

// ─── État partagé entre les hooks et les dessins ────────────────────────────
// Changer le tag `shape` si la forme d'une valeur change : l'ancienne est alors ignorée.
const durations = atom({ plugin: 'ui-friendly', key: 'durations' } as const, {}, { shape: 'durations-1' })
const opened = atom({ plugin: 'ui-friendly', key: 'opened' } as const, {}, { shape: 'opened-1' })
const KEEP = 400 // nombre d'appels gardés en mémoire
const SLOW_MS = 2000 // en dessous, la durée n'est pas affichée

// Outils repliés en une ligne. Les autres (Agent, AskUserQuestion, TodoWrite…) gardent leur dessin.
const COMPACT = new Set(['Bash', 'PowerShell', 'Read', 'Write', 'Edit', 'Grep', 'Glob', 'WebFetch', 'WebSearch'])
const isCompact = (tool: string): boolean =>
  COMPACT.has(tool) || (tool.startsWith('mcp__') && tool !== 'mcp__agent-monitor__progress')

let cwd = ''
let home = ''

// ─── Ligne résumé d'un outil ────────────────────────────────────────────────
type Summary = { verb: string; target: string; added?: number; removed?: number }

const str = (v: unknown): string => (typeof v === 'string' ? v : '')

// Un fichier se reconnaît à son nom et à son dossier : le chemin complet s'affiche au clic.
function fileLabel(p: string): string {
  return shortPath(p).split('/').slice(-2).join('/')
}

function shortPath(p: string): string {
  const norm = p.replace(/\\/g, '/')
  const base = cwd.replace(/\\/g, '/')
  if (base && norm.toLowerCase().startsWith(base.toLowerCase() + '/')) return norm.slice(base.length + 1)
  const h = home.replace(/\\/g, '/')
  if (h && norm.toLowerCase().startsWith(h.toLowerCase() + '/')) return '~/' + norm.slice(h.length + 1)
  return norm
}

function patchStats(output: unknown): { added: number; removed: number } | undefined {
  const patch = (output as { structuredPatch?: { lines: string[] }[] } | undefined)?.structuredPatch
  if (!Array.isArray(patch)) return
  let added = 0
  let removed = 0
  for (const hunk of patch) {
    for (const line of hunk.lines) {
      if (line.startsWith('+')) added++
      else if (line.startsWith('-')) removed++
    }
  }
  return { added, removed }
}

function summarize(tool: string, input: unknown, output: unknown): Summary {
  const i = (input ?? {}) as Record<string, unknown>
  switch (tool) {
    case 'Bash':
    case 'PowerShell':
      return { verb: tool === 'Bash' ? '$' : 'PS', target: str(i.description) || str(i.command).split('\n')[0] || '' }
    case 'Read':
      return { verb: 'Lu', target: fileLabel(str(i.file_path)) }
    case 'Edit':
      return { verb: 'Modifié', target: fileLabel(str(i.file_path)), ...patchStats(output) }
    case 'Write': {
      const stats = patchStats(output)
      const isNew = (output as { type?: string } | undefined)?.type === 'create'
      return {
        verb: isNew ? 'Créé' : 'Réécrit',
        target: fileLabel(str(i.file_path)),
        ...(isNew ? { added: str(i.content).split('\n').length } : stats),
      }
    }
    case 'Grep':
      return { verb: 'Cherché', target: `« ${str(i.pattern)} »${i.path ? ' dans ' + shortPath(str(i.path)) : ''}` }
    case 'Glob':
      return { verb: 'Listé', target: str(i.pattern) }
    case 'WebFetch':
      return { verb: 'Ouvert', target: str(i.url) }
    case 'WebSearch':
      return { verb: 'Recherche web', target: `« ${str(i.query)} »` }
  }
  // mcp__serveur__outil → « serveur · outil »
  const [, server = '', name = ''] = tool.split('__')
  return { verb: server.replace(/^claude_ai_/, ''), target: name }
}

function fmtDuration(ms: number | undefined): string {
  if (ms === undefined) return ''
  if (ms < 10_000) return `${(ms / 1000).toFixed(1).replace('.', ',')} s`
  if (ms < 60_000) return `${Math.round(ms / 1000)} s`
  const s = Math.round(ms / 1000)
  return `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')}`
}

// ─── Fond du terminal qui suit le thème (repris du skin Firelight, MIT) ─────
const ANSI = [
  'black', 'red', 'green', 'yellow', 'blue', 'purple', 'cyan', 'white',
  'brightBlack', 'brightRed', 'brightGreen', 'brightYellow', 'brightBlue', 'brightPurple', 'brightCyan', 'brightWhite',
] as const
type Scheme = { background: string; foreground: string; cursorColor: string } & Record<(typeof ANSI)[number], string>
const RESET = '\x1b]104\x07\x1b]110\x07\x1b]111\x07\x1b]112\x07'
const osc = (code: string, value: string): string => `\x1b]${code};${value}\x07`
const rgb = (hex: string): string => `rgb:${hex.slice(1, 3)}/${hex.slice(3, 5)}/${hex.slice(5, 7)}`
const colorSequence = (s: Scheme): string =>
  osc('11', rgb(s.background)) +
  osc('10', rgb(s.foreground)) +
  osc('12', rgb(s.cursorColor)) +
  osc('4', ANSI.map((name, i) => `${i};${rgb(s[name])}`).join(';'))

let schemes: Record<string, Scheme> | undefined
let painted = false
let queue: Promise<void> = Promise.resolve()

// Claude Code lance ses programmes d'aide avec une console cachée : sous Windows, le script s'attache à celle de Claude Code.
async function writeToTerminal($: Engine, text: string): Promise<void> {
  const argv = (await $.env.get('OS')) === 'Windows_NT'
    ? ['powershell.exe', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', `${$.plugin.root}/hooks/paint-console.ps1`]
    : ['sh', '-c', 'cat > /dev/tty']
  const { exitCode, stderr } = await $.process.run(argv, { stdin: text, timeoutMs: 5000 })
  if (exitCode !== 0) $.ui.log(`couleurs du terminal non appliquées (code ${exitCode}) : ${stderr.trim()}`, { to: 'debug' })
}

async function follow($: Engine, theme: unknown): Promise<void> {
  // « custom:opencode » (thème perso) ou « custom:ui-friendly:opencode » (thème fourni par le mod)
  const slug = typeof theme === 'string' && theme.startsWith('custom:') ? theme.split(':').pop() : undefined
  schemes ??= JSON.parse(await $.fs.read(`${$.plugin.root}/terminal-schemes.json`)) as Record<string, Scheme>
  const scheme = slug ? schemes[slug] : undefined
  if (scheme) {
    await writeToTerminal($, colorSequence(scheme))
    painted = true
  } else if (painted) {
    await writeToTerminal($, RESET)
    painted = false
  }
}

// /theme ne prévient pas les mods (seul le menu /config le fait) : on relit le thème régulièrement
// et on repeint le fond dès qu'il change.
const THEME_POLL_MS = 1500
let lastTheme: unknown
let themeTimer: Timer | undefined

async function syncTheme($: Engine): Promise<void> {
  const theme = (await $.config.list()).find(row => row.key === 'theme')?.value
  if (theme === lastTheme) return
  lastTheme = theme
  enqueue($, () => follow($, theme))
}

function enqueue($: Engine, work: () => Promise<void>): void {
  queue = queue.then(work).catch(err => $.ui.log(`couleurs du terminal non appliquées : ${err}`, { to: 'debug' }))
}

// ─── Hooks ──────────────────────────────────────────────────────────────────
export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const started = await next(e)
    $.ui.status(undefined) // efface la barre d'état laissée par la v0.1.0
    cwd = started.cwd
    home = (await $.env.get('USERPROFILE')) ?? (await $.env.get('HOME')) ?? ''
    if (e.surface === 'terminal' && e.isInteractive) {
      await syncTheme($)
      themeTimer?.cancel()
      themeTimer = $.clock.every(THEME_POLL_MS, () => void syncTheme($).catch(() => {}))
    }
    return started
  })

  on('config.set', { key: 'theme' }, async ($, e, next) => {
    const result = await next(e)
    if (!result.deny) {
      lastTheme = result.value
      enqueue($, () => follow($, result.value))
    }
    return result
  }).catch(($, e, next) => next(e))

  on('session.end', async ($, e, next) => {
    if (e.reason !== 'clear' && e.reason !== 'resume') {
      themeTimer?.cancel()
      themeTimer = undefined
      await queue
      if (painted) await writeToTerminal($, RESET).catch(() => {})
      painted = false
    }
    return next(e)
  })

  // Chronomètre chaque appel d'outil
  on('tool.call', async ($, e, next) => {
    const t0 = await $.clock.now()
    const ran = await next(e)
    const ms = (await $.clock.now()) - t0
    await update($, durations, all => Object.fromEntries([...Object.entries(all), [e.tool_use_id, ms]].slice(-KEEP)))
    return ran
  }).catch(($, e, next) => next(e)) // une panne du chrono ne doit jamais bloquer un outil

  on('ui.render', { component: 'ToolUse' }, async ($, e, next) => {
    const p = e.props
    // Erreurs, ctrl+o et outils non concernés : dessin complet de Claude Code
    if (e.surface !== 'terminal' || p.isExpanded || p.isErrored || !isCompact(p.tool)) return next(e)

    const { Box, Text, Button } = $.ui.resolve(e)
    const isOpen = (await read($, opened))[p.tool_use_id] === true
    const ms = (await read($, durations))[p.tool_use_id]
    const s = summarize(p.tool, p.input, p.output)

    const icon = p.isRunning
      ? <Text color="claude">◐</Text>
      : p.isInterrupted
        ? <Text color="warning">■</Text>
        : p.tool === 'Edit' || p.tool === 'Write'
          ? <Text color="success">✎ </Text> // Windows Terminal dessine ✎ plus large qu'une case : l'espace en plus évite qu'il touche le mot suivant
          : <Text color="success">✓</Text>

    const toggle = () =>
      void update($, opened, all => {
        const nextAll = { ...all }
        if (nextAll[p.tool_use_id]) delete nextAll[p.tool_use_id]
        else nextAll[p.tool_use_id] = true
        return Object.fromEntries(Object.entries(nextAll).slice(-KEEP)) as Record<string, true>
      })

    // Discret comme les lignes grises de Claude Code : seuls l'icône et les +/− ressortent.
    // La durée n'apparaît que pour un outil lent (une modification prend toujours 0,x s).
    // Seule la flèche est cliquable : Claude Code inverse toujours un Button sous la souris,
    // et une ligne entière inversée au survol dérange (retour de Mehdi, 2026-10-29).
    // La ligne vide au-dessus reprend le rythme des lignes d'outil de Claude Code (« Read 1 file »…).
    const row = (
      <Box paddingLeft={2} marginTop={1}>
        {icon}
        <Text> </Text>
        <Text dimColor>{s.verb}</Text>
        <Text> {s.target}</Text>
        {s.added !== undefined && <Text color="success">  +{s.added}</Text>}
        {s.removed !== undefined && <Text color="error"> −{s.removed}</Text>}
        <Text dimColor>
          {p.isRunning ? '  en cours…' : p.isInterrupted ? '  interrompu' : ms !== undefined && ms >= SLOW_MS ? `  · ${fmtDuration(ms)}` : ''}
        </Text>
        <Text>  </Text>
        <Button key={`uif-${p.tool_use_id}`} plain dimColor label={isOpen ? '▾' : '▸'} onPress={toggle} />
      </Box>
    )

    if (!isOpen) return row
    return (
      <Box flexDirection="column">
        {row}
        {await next(e)}
      </Box>
    )
  })

  on('ui.render', { component: 'ToolResult' }, async ($, e, next) => {
    const p = e.props
    if (e.surface !== 'terminal' || p.isExpanded || p.isErrored || !isCompact(p.tool)) return next(e)
    if ((await read($, opened))[p.tool_use_id]) return next(e)
    const { Box } = $.ui.resolve(e)
    return <Box />
  })
}
