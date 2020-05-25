import { DestinationStream } from 'pino'

import { DatadogStreamPinoConfig } from './config'

export function createWriteStream(config = new DatadogStreamPinoConfig()): DestinationStream {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires, import/no-unresolved
  const { createWriteStreamSync: datadogCreateWriteStream } = require('pino-datadog')

  return datadogCreateWriteStream({
    apiKey: config.DATADOG_API_KEY,
    ddsource: config.DATADOG_SOURCE,
    ddtags: config.DATADOG_TAGS,
    hostname: config.DATADOG_HOSTNAME,
    service: config.DATADOG_SERVICE,
    size: config.DATADOG_SIZE,
  })
}
