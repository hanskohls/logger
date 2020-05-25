import { destination, DestinationStream } from 'pino'

import { FileStreamPinoConfig } from './config'

export function createWriteStream(config = new FileStreamPinoConfig()): DestinationStream {
  return destination(config.FILENAME)
}
