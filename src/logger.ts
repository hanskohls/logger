import deepmerge from 'deepmerge'
import pino, { LevelWithSilent, Logger, LoggerOptions } from 'pino'
import pinoCaller from 'pino-caller'

import { LoggerConfig } from './config'

export { Logger } from 'pino'

export function loggerLevel(config: LoggerConfig): LevelWithSilent {
  if (config.LEVEL) {
    return config.LEVEL
  }

  switch (config.NODE_ENV) {
    case 'development':
      return 'debug'
    case 'test':
      return 'error'
    case 'production':
      return 'info'
    default:
      throw new Error(`Invalid NODE_ENV value "${config.NODE_ENV}".`)
  }
}

export function loggerPrettyPrint(): LoggerOptions['prettyPrint'] {
  return {
    translateTime: true,
    ignore: ['hostname', 'pid'].join(','),

    // TODO: this hasn't been added to types yet, check later if types have been updated.
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    suppressFlushSyncWarning: true,
  }
}

export function loggerOptions(config: LoggerConfig): LoggerOptions {
  const isPrettyPrintEnabled = process.stdout.isTTY && (config.isTest || config.isDevelopment)

  return {
    enabled: config.ENABLED,
    name: config.NAME,
    level: loggerLevel(config),
    prettyPrint: isPrettyPrintEnabled ? loggerPrettyPrint() : false,
    serializers: pino.stdSerializers,
  }
}

export function finalHandler(logger: Logger) {
  return pino.final(
    logger,
    (error, finalLogger, exitCode: number | null, message: string, ...arguments_: unknown[]) => {
      if (exitCode !== null) {
        finalLogger.fatal(error, message, ...arguments_)
      } else {
        finalLogger.info(message, ...arguments_)
      }

      if (exitCode !== null && Number.isInteger(exitCode)) {
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(exitCode)
      }
    },
  )
}

/**
 * Final logger can only be used with sync write destinations.
 *
 * * https://github.com/pinojs/pino/blob/master/docs/help.md#exit-logging
 * * https://github.com/pinojs/pino/blob/master/docs/api.md#pinofinallogger-handler--function--finallogger
 * * https://github.com/pinojs/pino-pretty/issues/37
 */
export function setupUnhandledRejectionHandler(final: ReturnType<typeof finalHandler>) {
  return process.on('unhandledRejection', (reason) => {
    const exitCode = 1

    // https://nodejs.org/api/process.html#process_event_unhandledrejection
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33636
    // Per NodeJS docs, "reason" is <Error> | <any> type.
    // But in the @types, "reason: is an "unknown" type, so we refine it.
    if (reason instanceof Error) {
      return final(reason, exitCode, 'unhandledRejection')
    }
    // eslint-disable-next-line unicorn/no-null
    return final(null, exitCode, 'unhandledRejection with reason: %s', reason)
  })
}

export function setupUncaughtExceptionHandler(final: ReturnType<typeof finalHandler>) {
  return process.on('uncaughtException', (error) => final(error, 1, 'uncaughtException'))
}

export function setupExitHandler(final: ReturnType<typeof finalHandler>) {
  // eslint-disable-next-line unicorn/no-null
  return process.on('exit', (code) => final(null, null, 'exit with code %d.', code))
}

export function setupPinoCaller(logger: Logger): Logger {
  return pinoCaller(logger)
}

/**
 * Creates an instance of a logger and returns it.
 */
export function createLogger(
  options: Partial<LoggerOptions> = {},
  config = new LoggerConfig(),
): Logger {
  const options_ = deepmerge(loggerOptions(config), options)
  let logger = pino(options_)

  const destination = pino.destination({ sync: true })
  const finalLoggerHandler = finalHandler(pino(options_, destination))

  setupExitHandler(finalLoggerHandler)

  // We only setup global handlers in production, because the output is JSON and it is quite
  // messy to look at in development & testing. In those environments it is easier to look at the
  // default throw up of the NodeJS.
  if (config.isProduction) {
    setupUnhandledRejectionHandler(finalLoggerHandler)
    setupUncaughtExceptionHandler(finalLoggerHandler)
  }

  if (config.CALLER) {
    logger = setupPinoCaller(logger)
  }

  return logger
}
