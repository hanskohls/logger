import { BaseConfig } from '@scaleleap/config'
import { LevelWithSilent } from 'pino'

import { ENV_KEY_PREFIX } from './constants'

const LOG_LEVELS: Readonly<LevelWithSilent[]> = [
  'debug',
  'error',
  'fatal',
  'info',
  'trace',
  'warn',
  'silent',
] as const

export class LoggerConfig extends BaseConfig {
  protected readonly prefix = ENV_KEY_PREFIX

  public readonly NAME = this.get('NAME').asString()

  public readonly LEVEL = this.get('LEVEL').asEnum([...LOG_LEVELS]) as LevelWithSilent

  public readonly ENABLED = this.get('ENABLED').default('true').asBoolStrict()

  public readonly CALLER = this.get('CALLER').default('false').asBoolStrict()
}
