import { expect, mock, test } from 'claude-code/testing'

const ANSI = ['black', 'red', 'green', 'yellow', 'blue', 'purple', 'cyan', 'white',
  'brightBlack', 'brightRed', 'brightGreen', 'brightYellow', 'brightBlue', 'brightPurple', 'brightCyan', 'brightWhite']
const scheme = (background: string) =>
  ({ background, foreground: '#EEEEEE', cursorColor: '#FAB283', ...Object.fromEntries(ANSI.map(k => [k, '#808080'])) })
const SCHEMES = JSON.stringify({ opencode: scheme('#0A0A0A'), 'minimal-kiwi': scheme('#212121') })

test('un thème changé avec /theme, sans signal de Claude Code, repeint quand même le fond', async ($, on) => {
  const clock = mock.clock(on)
  mock.env(on, { OS: 'Windows_NT' })
  let theme = 'custom:minimal-kiwi'
  const painted: string[] = []
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('ui.status', () => ({ value: undefined }))
  on('ui.log', () => ({ value: undefined }))
  on('config.list', () => ({ value: [{ key: 'theme', value: theme }] }))
  on('fs.read', () => ({ value: SCHEMES }))
  on('process.run', (_, e) => {
    painted.push(String(e.init?.stdin ?? ''))
    return { value: { exitCode: 0, stdout: '', stderr: '' } }
  })

  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })
  await clock.settle()
  expect(painted.at(-1)).toContain('rgb:21/21/21') // fond Kiwi au démarrage

  theme = 'custom:opencode' // ce que fait /theme : le réglage change, aucun config.set
  await clock.advance(2000)
  expect(painted.at(-1)).toContain('rgb:0A/0A/0A') // fond OpenCode repeint

  const count = painted.length
  await clock.advance(5000)
  expect(painted.length).toBe(count) // thème inchangé : on ne repeint pas pour rien
})
