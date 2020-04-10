import pino, { Logger, LevelWithSilent, LoggerOptions } from 'pino'
import pinoDebug from 'pino-debug'
import deepmerge from 'deepmerge'
import { LoggerConfig } from './config'

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
  const isPrettyPrintEnabled = config.isDevelopment && process.stdout.isTTY

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
export function setupFinalLogger(logger: Logger) {
  process.on('unhandledRejection', (reason, promise) => {
    promise
      .catch((err) => logger.fatal(err, reason, 'Unhandled Rejection'))
      .finally(() => {
        process.exit(1)
      })
  })

  process.on(
    'uncaughtException',

    pino.final(logger, (err, finalLogger) => {
      finalLogger.fatal(err, 'Uncaught Exception')
      process.exit(1)
    }),
  )
}

/**
 * Creates an instance of a logger and returns it.
 */
export function createLogger(options: Partial<LoggerOptions> = {}, config = new LoggerConfig()): Logger {
  const opts = deepmerge(loggerOptions(config), options)
  const logger = pino(opts)

  // We only setup global handlers in production, because the output is JSON and it is quite
  // messy to look at in development & testing. In those environments it is easier to look at the
  // default throw up of the NodeJS.
  if (config.isProduction) {
    setupFinalLogger(logger)
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
