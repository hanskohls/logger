import pino, { Logger } from 'pino'
import { file, FileResult } from 'tmp-promise'

import { LoggerConfig } from './config'
import {
  createLogger,
  finalHandler,
  loggerLevel,
  loggerOptions,
  setupUncaughtExceptionHandler,
  setupUnhandledRejectionHandler,
} from './logger'

describe('logger', () => {
  describe(`${loggerLevel.name}`, () => {
    it('should return debug in development environment', () => {
      expect.assertions(1)

      expect(loggerLevel(new LoggerConfig({ NODE_ENV: 'development' }))).toBe('debug')
    })

    it('should return error in test environment', () => {
      expect.assertions(1)

      expect(loggerLevel(new LoggerConfig({ NODE_ENV: 'test' }))).toBe('error')
    })

    it('should return info in production environment', () => {
      expect.assertions(1)

      expect(loggerLevel(new LoggerConfig({ NODE_ENV: 'production' }))).toBe('info')
    })

    it('should return overrideable value with LOGGER_LEVEL', () => {
      expect.assertions(1)

      expect(loggerLevel(new LoggerConfig({ LOGGER_LEVEL: 'fatal' }))).toBe('fatal')
    })
  })

  describe(`${loggerOptions.name}`, () => {
    it('should return a pino config object', () => {
      expect.assertions(1)

      const options = loggerOptions(new LoggerConfig())

      expect(options).toHaveProperty('level')
    })

    it('should have pretty print enabled in development', () => {
      expect.assertions(1)

      const { isTTY } = process.stdout
      process.stdout.isTTY = true

      const options = loggerOptions(new LoggerConfig({ NODE_ENV: 'development' }))

      expect(options.prettyPrint).not.toBe(false)

      process.stdout.isTTY = isTTY
    })

    it('should have pretty print enabled in test', () => {
      expect.assertions(1)

      const { isTTY } = process.stdout
      process.stdout.isTTY = true

      const options = loggerOptions(new LoggerConfig({ NODE_ENV: 'test' }))

      expect(options.prettyPrint).not.toBe(false)

      process.stdout.isTTY = isTTY
    })

    it('should have pretty print disabled in production', () => {
      expect.assertions(1)

      const options = loggerOptions(new LoggerConfig({ NODE_ENV: 'production' }))

      expect(options.prettyPrint).toBe(false)
    })
  })

  describe('final logger', () => {
    let temporary: FileResult
    let logger: Logger

    beforeEach(async () => {
      // Final logging requires streams with file descriptors, but jest
      // seems to be messing with stdout file descriptor. So we create a logging destination to
      // file instead.
      temporary = await file()
      logger = pino(pino.destination(temporary.path))
    })

    describe(`${finalHandler.name}`, () => {
      it('returns a handler for final logger', () => {
        expect.assertions(1)

        const handler = finalHandler(logger)

        expect(typeof handler).toBe('function')
      })
    })

    describe(`${setupUnhandledRejectionHandler.name}`, () => {
      it('sets unhandledRejection handler', () => {
        expect.assertions(1)

        process.removeAllListeners('unhandledRejection')

        const processResponse = setupUnhandledRejectionHandler(finalHandler(logger))

        expect(processResponse.listenerCount('unhandledRejection')).toBe(1)
      })
    })

    describe(`${setupUncaughtExceptionHandler.name}`, () => {
      it('sets uncaughtException handler', () => {
        expect.assertions(1)

        process.removeAllListeners('uncaughtException')

        const processResponse = setupUncaughtExceptionHandler(finalHandler(logger))

        expect(processResponse.listenerCount('uncaughtException')).toBe(1)
      })
    })
  })

  describe(`${createLogger.name}`, () => {
    it('should return a logger object', () => {
      expect.assertions(1)

      const logger = createLogger()

      expect(logger).toHaveProperty('info')
    })

    it('should accept options', () => {
      expect.assertions(3)

      const logger = createLogger({ enabled: false })

      expect(logger.isLevelEnabled('error')).toBe(false)
      expect(logger.isLevelEnabled('fatal')).toBe(false)
      expect(logger.isLevelEnabled('silent')).toBe(true)
    })
  })
})
