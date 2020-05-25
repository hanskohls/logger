import { Logger } from 'pino'

import { createLogger } from './logger'

let LOGGER: Logger

function init() {
  if (!LOGGER) {
    LOGGER = createLogger()
  }
}

/**
 * An auto-instantiating logger.
 *
 * An instance of logger will be created by using it.
 *
 * Suitable for quick prototyping and quick scripts.
 */
export const log = new Proxy({} as Logger, {
  has: (target, key) => {
    init()

    return key in LOGGER
  },
  get: (target, key) => {
    init()

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return LOGGER[key]
  },
  set: (target, key: keyof Logger, value) => {
    init()

    LOGGER[key] = value

    return true
  },
})
