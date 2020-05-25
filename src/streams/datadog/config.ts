import { BaseConfig } from '@scaleleap/config'

import { ENV_KEY_PREFIX } from '../../constants'

// See https://github.com/ovhemert/pino-datadog/blob/master/docs/API.md#functions
export class DatadogStreamPinoConfig extends BaseConfig {
  protected readonly prefix = ENV_KEY_PREFIX

  public readonly DATADOG_API_KEY = this.get('DATADOG_API_KEY').required().asString()

  public readonly DATADOG_SIZE = this.get('DATADOG_SIZE').default('1').asIntPositive()

  public readonly DATADOG_SOURCE = this.get('DATADOG_SOURCE').asString()

  public readonly DATADOG_TAGS = this.get('DATADOG_TAGS').asString()

  public readonly DATADOG_SERVICE = this.get('DATADOG_SERVICE').asString()

  public readonly DATADOG_HOSTNAME = this.get('DATADOG_HOSTNAME').asString()
}
