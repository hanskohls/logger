import pino from 'pino'
import { file, FileResult } from 'tmp-promise'
import { readFileSync } from 'fs'
import { createWriteStream } from './stream'
import { FileStreamPinoConfig } from './config'

describe.skip('Datadog Stream', () => {
  describe(createWriteStream.name, () => {
    let tmp: FileResult

    beforeEach(async () => {
      tmp = await file()
    })

    afterEach(() => tmp.cleanup())

    it('should return a DestinationStream', async () => {
      expect.hasAssertions()

      const config = new FileStreamPinoConfig({ SL_LOGGER_FILENAME: tmp.path })
      const stream = createWriteStream(config)

      expect(stream).toHaveProperty('write')
    })

    it('should work with pino', async () => {
      expect.hasAssertions()

      const logMessage = 'foo123'

      const config = new FileStreamPinoConfig({ SL_LOGGER_FILENAME: tmp.path })
      const stream = createWriteStream(config)

      const log = pino(stream)
      expect(log).toBeTruthy()

      log.info(logMessage)

      // waits for the log message to sync to disk
      await new Promise((resolve) => setTimeout(resolve, 100))

      const logContent = readFileSync(tmp.path, { encoding: 'utf8' })
      expect(logContent).toContain(logMessage)
    })
  })
})
