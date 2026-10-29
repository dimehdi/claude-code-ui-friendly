import { expect, test } from 'claude-code/testing'

const EDIT = {
  plugin: 'ui-friendly',
  component: 'ToolUse',
  requestId: 'call-1',
  surface: 'terminal',
  props: {
    tool_use_id: 'call-1',
    tool: 'Edit',
    input: { file_path: '/projet/app.ts', old_string: 'a', new_string: 'b\nc' },
    isRunning: false,
    isErrored: false,
    isInterrupted: false,
    output: { structuredPatch: [{ oldStart: 1, oldLines: 1, newStart: 1, newLines: 2, lines: ['-a', '+b', '+c'] }] },
  },
} as const

// Ce hook tient lieu du dessin de Claude Code sous le mod
const engineDraws = (on: Parameters<Parameters<typeof test>[1]>[1]) =>
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>dessin complet</Text>
  })

test("une modification tient sur une ligne avec ses +/−, et se déplie au clic", async ($, on) => {
  engineDraws(on)
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('env.get', () => ({ value: undefined }))
  on('config.list', () => ({ value: [] }))
  await $.session.start({ cwd: '/projet', surface: 'terminal', isInteractive: false })

  const folded = await $.ui.mount(EDIT)
  expect((await folded.find({ type: 'Text', text: /Modifié/ }))?.text).toBe('Modifié')
  expect((await folded.find({ type: 'Text', text: /app\.ts/ }))?.text).toBe(' app.ts')
  expect((await folded.find({ type: 'Text', text: /\+2/ }))?.text).toBe('  +2')
  expect((await folded.find({ type: 'Text', text: /−1/ }))?.text).toBe(' −1')
  expect(await folded.find({ type: 'Text', text: /dessin complet/ })).toBeUndefined()
  await $.ui.press({ plugin: 'ui-friendly', key: 'uif-call-1' })
  await folded.unmount()

  const open = await $.ui.mount(EDIT)
  expect((await open.find({ type: 'Text', text: /dessin complet/ }))?.text).toBe('dessin complet')
  await open.unmount()
})

test('une erreur reste toujours dépliée', async ($, on) => {
  engineDraws(on)
  const ui = await $.ui.mount({ ...EDIT, props: { ...EDIT.props, isErrored: true } })
  expect((await ui.find({ type: 'Text', text: /dessin complet/ }))?.text).toBe('dessin complet')
  await ui.unmount()
})

test("les outils non concernés gardent le dessin de Claude Code", async ($, on) => {
  engineDraws(on)
  const ui = await $.ui.mount({ ...EDIT, props: { ...EDIT.props, tool: 'Agent' } })
  expect((await ui.find({ type: 'Text', text: /dessin complet/ }))?.text).toBe('dessin complet')
  await ui.unmount()
})
