declare module 'pino-multi-stream' {
  import { DestinationStream, Level, Logger, LoggerOptions as PinoLoggerOptions } from 'pino'

  interface Stream {
    stream: DestinationStream
    level: Level
  }

  interface LoggerOptions extends PinoLoggerOptions {
    streams?: Stream[]
  }

  export default function pinoms(options: LoggerOptions): Logger

  export function multistream(streams: Stream[]): DestinationStream

  export function prettyStream(options: PinoLoggerOptions): DestinationStream
}
