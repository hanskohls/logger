import { readFileSync } from 'fs'
import pino, { Logger } from 'pino'
import { file, FileResult } from 'tmp-promise'
import {
  loggerLevel,
  loggerOptions,
  setupUnhandledRejectionHandler,
  setupUncaughtExceptionHandler,
  setupPinoCaller,
  createLogger,
} from './logger'
import { LoggerConfig } from './config'

describe('logger', () => {
  describe(loggerLevel.name, () => {
    it('should return debug in development environment', () => {
      expect(loggerLevel(new LoggerConfig({ NODE_ENV: 'development' }))).toBe('debug')
    })

    it('should return error in test environment', () => {
      expect(loggerLevel(new LoggerConfig({ NODE_ENV: 'test' }))).toBe('error')
    })

    it('should return info in production environment', () => {
      expect(loggerLevel(new LoggerConfig({ NODE_ENV: 'production' }))).toBe('info')
    })

    it('should return overrideable value with LOGGER_LEVEL', () => {
      expect(loggerLevel(new LoggerConfig({ LOGGER_LEVEL: 'fatal' }))).toBe('fatal')
    })
  })

  describe(loggerOptions.name, () => {
    it('should return a pino config object', () => {
      const opts = loggerOptions(new LoggerConfig())
      expect(opts).toHaveProperty('level')
    })

    it('should have pretty print enabled in development', () => {
      const { isTTY } = process.stdout
      process.stdout.isTTY = true

      const opts = loggerOptions(new LoggerConfig({ NODE_ENV: 'development' }))
      expect(opts.prettyPrint).not.toBe(false)

      process.stdout.isTTY = isTTY
    })

    it('should have pretty print enabled in test', () => {
      const { isTTY } = process.stdout
      process.stdout.isTTY = true

      const opts = loggerOptions(new LoggerConfig({ NODE_ENV: 'test' }))
      expect(opts.prettyPrint).not.toBe(false)

      process.stdout.isTTY = isTTY
    })

    it('should have pretty print disabled in production', () => {
      const opts = loggerOptions(new LoggerConfig({ NODE_ENV: 'production' }))
      expect(opts.prettyPrint).toBe(false)
    })
  })

  describe(setupUnhandledRejectionHandler.name, () => {
    let tmp: FileResult
    let logger: Logger

    beforeEach(async () => {
      // Final logging requires streams with file descriptors, but jest
      // seems to be messing with stdout file descriptor. So we create a logging destination to
      // file instead.
      tmp = await file()
      logger = pino(pino.destination(tmp.path))
    })

    it('sets unhandledRejection handler', () => {
      process.removeAllListeners('unhandledRejection')

      const processRes = setupUnhandledRejectionHandler(logger)

      expect(processRes.listenerCount('unhandledRejection')).toBe(1)
    })

    it('sets uncaughtException handler', () => {
      process.removeAllListeners('uncaughtException')

      const processRes = setupUncaughtExceptionHandler(logger)

      expect(processRes.listenerCount('uncaughtException')).toBe(1)
    })
  })

  describe(setupPinoCaller.name, () => {
    it('should create wrap logger and emit caller info', async () => {
      const tmp = await file()
      const logger = setupPinoCaller(pino(pino.destination(tmp.path)))
      logger.level = 'info'

      logger.info('foo')
      logger.flush()

      const logContent = readFileSync(tmp.path)
      console.log(logContent)
    })
  })

  describe(createLogger.name, () => {
    it('should return a logger object', () => {
      const logger = createLogger()

      expect(logger).toHaveProperty('info')
    })

    it('should accept options', () => {
      const logger = createLogger({ enabled: false })

      expect(logger.isLevelEnabled('error')).toBe(false)
      expect(logger.isLevelEnabled('fatal')).toBe(false)
      expect(logger.isLevelEnabled('silent')).toBe(true)
    })
  })
})
