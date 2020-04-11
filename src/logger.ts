import pino, { Logger, LevelWithSilent, LoggerOptions } from 'pino'
import pinoDebug from 'pino-debug'
import pinoCaller from 'pino-caller'
import deepmerge from 'deepmerge'
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

/**
 * Final logger can only be used with sync write destinations.
 *
 * * https://github.com/pinojs/pino/blob/master/docs/help.md#exit-logging
 * * https://github.com/pinojs/pino/blob/master/docs/api.md#pinofinallogger-handler--function--finallogger
 * * https://github.com/pinojs/pino-pretty/issues/37
 */
export function setupUnhandledRejectionHandler(logger: Logger) {
  return process.on(
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignores
    'unhandledRejection',

    pino.final(logger, (err, finalLogger) => {
      finalLogger.error(err, 'Unhandled Rejection')
      process.exit(1)
    }),
  )
}

export function setupUncaughtExceptionHandler(logger: Logger) {
  return process.on(
    'uncaughtException',

    pino.final(logger, (err, finalLogger) => {
      finalLogger.fatal(err, 'Uncaught Exception')
      process.exit(1)
    }),
  )
}

export function setupPinoCaller(logger: Logger): Logger {
  return pinoCaller(logger)
}

/**
 * Creates an instance of a logger and returns it.
 */
export function createLogger(options: Partial<LoggerOptions> = {}, config = new LoggerConfig()): Logger {
  const opts = deepmerge(loggerOptions(config), options)
  let logger = pino(opts)

  // We only setup global handlers in production, because the output is JSON and it is quite
  // messy to look at in development & testing. In those environments it is easier to look at the
  // default throw up of the NodeJS.
  if (config.isProduction) {
    setupUnhandledRejectionHandler(logger)
    setupUncaughtExceptionHandler(logger)
  }

  if (config.isDevelopment) {
    logger = setupPinoCaller(logger)
  }

  if (logger.isLevelEnabled('trace')) {
    // TODO: pinoDebug can only be called once
    pinoDebug(logger, {
      auto: true,
      map: {
        'scaleleap:*': 'debug',
        '*': 'trace',
      },
    })
  }

  return logger
}
