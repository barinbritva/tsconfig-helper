import fs from 'fs'
import {getData} from '../shared/data'
import {OptionMap} from '../shared/types'
import { isDefinedCondition, isMultipleCondition } from '../shared/utils'
import {TsConfig} from './interfaces'

export class ConfigHelper {
  private config: TsConfig
  private configDescriptor: OptionMap

  constructor() {
    // todo remove comments
    // todo process extends

    const configPath = process.argv[2]
    this.assertConfigPathIsValid(configPath)
    this.config = this.readConfig(configPath)
    this.configDescriptor = getData()
  }

  public show(): TsConfig {
    return this.completeConfig()
  }

  private completeConfig(): TsConfig {
    const descriptors = Array.from(Object.entries(this.configDescriptor), (pair) => {
      return pair[1]
    })

    descriptors.forEach((descriptor) => {
      if (descriptor.default === undefined || this.isOptionDefined(descriptor.name)) {
        return
      }

      const defaults = Array.isArray(descriptor.default) ? descriptor.default : [descriptor.default]
      // todo do for all values
      const defaultValue = defaults[0]

      // todo make type casting before define option
      if (typeof defaultValue === 'string') {
        this.defineOption(descriptor.name, defaultValue, descriptor.inRoot)
      } else if (isDefinedCondition(defaultValue)) {
        if (this.isOptionDefined(defaultValue.option)) {
          this.defineOption(descriptor.name, defaultValue.conditions.defined)
        } else if (defaultValue.conditions.notDefined !== undefined) {
          this.defineOption(descriptor.name, defaultValue.conditions.notDefined)
        }
      } else if (isMultipleCondition(defaultValue)) {
        const relatedOptionValue = this.config[defaultValue.option as keyof TsConfig]
        const suitablePair = defaultValue.conditions.values.find((value) => {
          return value[0] === relatedOptionValue
        })

        if (suitablePair === undefined) {
          if (defaultValue.conditions.otherwise !== undefined) {
            this.defineOption(descriptor.name, defaultValue.conditions.otherwise)
          }
        } else {
          this.defineOption(descriptor.name, suitablePair[1])
        }
      }
    })

    return this.config
  }

  private assertConfigPathIsValid(path: string): void {
    if (path == null) {
      throw new Error('Config path not passed.')
    }

    if (!fs.existsSync(path)) {
      throw new Error('Config file not found in ' + path)
    }
  }

  private readConfig(path: string): TsConfig {
    const content = fs.readFileSync(path, {encoding: 'utf8'})
    return JSON.parse(content)
  }

  private isOptionDefined(key: string, searchInRoot = false): boolean {
    // todo fix keyof TsConfig
    if (searchInRoot) {
      return this.config[key as keyof TsConfig] !== undefined
    } else {
      return this.config.compilerOptions[key as keyof TsConfig] !== undefined
    }
  }

  // todo write generic
  private defineOption(key: string, value: any, defineInRoot = false): void {
    if (defineInRoot) {
      this.config[key as keyof TsConfig] = value
    } else {
      this.config.compilerOptions[key as keyof TsConfig] = value
    }
  }
}


