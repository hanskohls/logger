import { DestinationStream } from 'pino'

export function createWriteStream(): DestinationStream {
  return process.stdout
}
