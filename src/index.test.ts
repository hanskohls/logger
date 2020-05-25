import { createLogger, createTestLogger, log } from '.'

describe('index', () => {
  it('should export createLogger function', () => {
    expect.assertions(1)

    expect(typeof createLogger).toBe('function')
  })

  it('should export createTestLogger function', () => {
    expect.assertions(1)

    expect(typeof createTestLogger).toBe('function')
  })

  it('should export log object', () => {
    expect.assertions(2)

    expect(log).not.toBeUndefined()
    expect(log).toHaveProperty('info')
  })
})
