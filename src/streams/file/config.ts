import { BaseConfig } from '@scaleleap/config'
import { ENV_KEY_PREFIX } from '../../constants'

export class FileStreamPinoConfig extends BaseConfig {
  protected readonly prefix = ENV_KEY_PREFIX

  public readonly FILENAME = this.get('FILENAME').required().asString()
}
