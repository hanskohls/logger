import { createWriteStream } from './stream'

describe('datadog Stream', () => {
  describe(`${createWriteStream.name}`, () => {
    it('should create a stream', () => {
      expect.assertions(1)

      const stream = createWriteStream()

      expect(stream).toHaveProperty('write')
    })
  })
})
