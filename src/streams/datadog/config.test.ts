import { ENV_KEY_PREFIX } from '../../constants'
import { DatadogStreamPinoConfig } from './config'

describe('datadog Stream', () => {
  describe(`${DatadogStreamPinoConfig.name}`, () => {
    it('should read an API key from a prefixed variable', () => {
      expect.hasAssertions()

      const API_KEY = 'foo'

      const config = new DatadogStreamPinoConfig({
        [`${ENV_KEY_PREFIX}DATADOG_API_KEY`]: API_KEY,
      })

      expect(config.DATADOG_API_KEY).toBe(API_KEY)
    })

    it('should require an API key', () => {
      expect.hasAssertions()

      expect(() => new DatadogStreamPinoConfig()).toThrow(/required/)
    })

    it('should have all of the properties', () => {
      expect.hasAssertions()

      const config = new DatadogStreamPinoConfig({
        [`${ENV_KEY_PREFIX}DATADOG_API_KEY`]: 'x',
      })

      expect(config).toHaveProperty('DATADOG_API_KEY')
      expect(config).toHaveProperty('DATADOG_SIZE')
      expect(config).toHaveProperty('DATADOG_SOURCE')
      expect(config).toHaveProperty('DATADOG_TAGS')
      expect(config).toHaveProperty('DATADOG_SERVICE')
      expect(config).toHaveProperty('DATADOG_HOSTNAME')
    })
  })
})
