import { createLogger, log } from '../src/index'

test('should export createLogger function', () => {
  expect(typeof createLogger).toBe('function')
})

test('should export log object', () => {
  expect(log).toBeTruthy()
})
