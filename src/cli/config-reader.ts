import fs from 'fs'
import {TsConfig} from './interfaces'

export class ConfigReader {
  public read(fullPath: string): TsConfig {
    this.assertConfigPathIsValid(fullPath)
    return this.readConfig(fullPath)
  }

  private assertConfigPathIsValid(path: string): void {
    if (path == null) {
      throw new Error('Config path not passed.')
    }

    if (!fs.existsSync(path)) {
      throw new Error('Config file not found in ' + path + '.')
    }
  }

  private readConfig(path: string): TsConfig {
    const content = fs.readFileSync(path, {encoding: 'utf8'})
    console.log(content)
    // todo remove comments
    // todo process `extends` option
    return JSON.parse(content)
  }
}
