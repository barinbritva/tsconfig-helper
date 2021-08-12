import fs from 'fs'
import {TsConfig} from './interfaces'

export abstract class InputOutput {
  public static read(fullPath: string): TsConfig {
    InputOutput.assertConfigPathIsValid(fullPath)
    return InputOutput.readConfig(fullPath)
  }

  public static toString(config: TsConfig): string {
    return JSON.stringify(config, undefined, 2)
  }

  public static write(config: TsConfig | string, path: string): void {
    if (typeof config === 'object') {
      config = InputOutput.toString(config)
    }
    
    fs.writeFileSync(path, config)
  }

  private static assertConfigPathIsValid(path: string): void {
    if (path == null) {
      throw new Error('Config path not passed.')
    }

    if (!fs.existsSync(path)) {
      throw new Error('Config file not found in ' + path + '.')
    }
  }

  private static readConfig(path: string): TsConfig {
    const content = fs.readFileSync(path, {encoding: 'utf8'})
    // todo remove comments
    // todo process `extends` option
    return JSON.parse(content)
  }
}
