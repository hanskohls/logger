import { createWriteStream } from './stream'

describe('Datadog Stream', () => {
  describe(createWriteStream.name, () => {
    it('should create a stream', () => {
      expect.hasAssertions()

      const stream = createWriteStream()

      expect(stream).toHaveProperty('write')
    })
  })
})
