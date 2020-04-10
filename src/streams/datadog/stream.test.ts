import { createWriteStream } from './stream'
import { DatadogStreamPinoConfig } from './config'
import { ENV_KEY_PREFIX } from '../../constants'

describe.skip('Datadog Stream', () => {
  describe(createWriteStream.name, () => {
    it('should return a stream', () => {
      expect.hasAssertions()

      const config = new DatadogStreamPinoConfig({
        [`${ENV_KEY_PREFIX}DATADOG_API_KEY`]: 'x',
      })

      const stream = createWriteStream(config)

      expect(stream).toHaveProperty('write')
    })
  })
})
