import {getData} from '../shared/data'
import { OptionDescriptor } from '../shared/interfaces'
import {OptionMap} from '../shared/types'
import { isDefinedCondition, isMultipleCondition } from '../shared/utils'
import {TsConfig} from './interfaces'

export class ConfigHelper {
  private config: TsConfig
  private configDescriptor: OptionMap

  constructor(configOrPath: TsConfig) {
    this.configDescriptor = getData()
    this.config = configOrPath
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
      
      const defaultDescriptors: OptionDescriptor[] = Array.isArray(descriptor.default)
      ? descriptor.default
      : [descriptor.default]


      const defaultValues = defaultDescriptors.map((defaultValue) => {
        // todo make type casting before define option
        if (isDefinedCondition(defaultValue)) {
          if (this.isOptionDefined(defaultValue.option)) {
            return defaultValue.conditions.defined
          } else if (defaultValue.conditions.notDefined !== undefined) {
            return defaultValue.conditions.notDefined
          }
        } else if (isMultipleCondition(defaultValue)) {
          const relatedOptionValue = this.config[defaultValue.option as keyof TsConfig]
          const suitablePair = defaultValue.conditions.values.find((value) => {
            return value[0] === relatedOptionValue
          })

          if (suitablePair === undefined) {
            if (defaultValue.conditions.otherwise !== undefined) {
              return defaultValue.conditions.otherwise
            }
          } else {
            return suitablePair[1]
          }
        } else {
          return defaultValue
        }
      })

      const mergedValue = this.mergeDefaultValuePieces(defaultValues)
      this.defineOption(descriptor.name, mergedValue, descriptor.inRoot)
    })

    return this.config
  }

  private isOptionDefined(key: string, searchInRoot = false): boolean {
    // todo fix keyof TsConfig
    if (searchInRoot) {
      return this.config[key as keyof TsConfig] !== undefined
    } else {
      return this.config.compilerOptions[key as keyof TsConfig] !== undefined
    }
  }

  private defineOption(key: string, value: any, defineInRoot = false): void {
    if (defineInRoot) {
      this.config[key as keyof TsConfig] = value
    } else {
      this.config.compilerOptions[key as keyof TsConfig] = value
    }
  }

  private mergeDefaultValuePieces(pieces: unknown[]): unknown {
    // todo ! check for dynamic value %flag%
    if (pieces.length === 1) {
      return pieces[0]
    }

    const mergedValues: unknown[] = []
    pieces.forEach((piece) => {
      if (piece === undefined) {
        return
      }

      if (Array.isArray(piece)) {
        mergedValues.push(...piece)
      } else {
        // if other cases appear, improve the logic
        throw new Error('Value merging are available only for arrays. Given: ' + pieces.join(', '))
      }
    })

    return mergedValues
  }
}


