import pino, { LogDescriptor, LoggerOptions } from 'pino'
import { ObjectWritableMock } from 'stream-mock'

function logLines(lines: string[]) {
  return lines.map<LogDescriptor>((line) => JSON.parse(line))
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createTestLogger(options: Partial<LoggerOptions> = {}) {
  const writableMock = new ObjectWritableMock()

  return Object.assign(pino(options, writableMock), {
    writableMock,
    logLines: () => logLines(writableMock.data),
  })
}
