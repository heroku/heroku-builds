import {ux} from '@oclif/core/ux'

function stripAnsi(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replaceAll(/\[[0-9;]*m/g, '')
}

export function stubUxActionStart() {
  const originalStart = ux.action.start
  ux.action.start = (message: string) => {
    process.stderr.write(`${stripAnsi(message)}... `)
  }

  const originalStop = ux.action.stop
  ux.action.stop = (messageToWrite = 'done') => {
    process.stderr.write(`${stripAnsi(messageToWrite)}\n`)
  }

  return {
    restore() {
      ux.action.start = originalStart
      ux.action.stop = originalStop
    },
  }
}
