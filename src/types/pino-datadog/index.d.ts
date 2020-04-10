interface PinoDataDogOptions {
  /**
   * The API key that can be found in your DataDog account (Integration > APIs).
   */
  apiKey: string

  /**
   * The number of log messages to send as a single batch (defaults to 1).
   */
  size?: number

  /**
   * Set a default source to all the logs sent to datadog
   */
  ddsource?: string

  /**
   * Set a default list of tags for all the logs sent to datadog
   */
  ddtags?: string

  /**
   * Set a default service to all the logs sent to datadog
   */
  service?: string

  /**
   * Set a default hostname to all the logs sent to datadog
   */
  hostname?: string

  /**
   * Use EU servers.
   */
  eu?: boolean
}

declare module 'pino-datadog' {
  import { WriteStream } from 'fs'

  export function createWriteStream(options: PinoDataDogOptions): WriteStream
  export function createWriteStreamSync(options: PinoDataDogOptions): WriteStream
}
