import {getData} from '../shared/data'
import { OptionDescriptor } from '../shared/interfaces'
import {OptionMap} from '../shared/types'
import { isDefinedCondition, isMultipleCondition } from '../shared/utils'
import {TsConfig} from './interfaces'

export class ConfigCompletor {
  private resultConfig: TsConfig
  private configDescriptor: OptionMap

  constructor(private originalConfig: TsConfig) {
    // instead of deep clone
    this.resultConfig = JSON.parse(JSON.stringify(this.originalConfig))
    this.configDescriptor = getData()
    this.completeConfig()
  }

  public getResultConfig(): TsConfig {
    return this.resultConfig
  }

  public getOriginalConfig(): TsConfig {
    return this.originalConfig
  }

  private completeConfig(): TsConfig {
    const descriptors = Array.from(Object.entries(this.configDescriptor), (pair) => {
      return pair[1]
    })

    descriptors.forEach((descriptor) => {
      if (
        descriptor.default === undefined ||
        this.isOptionDefined(descriptor.name, descriptor.inRoot)
      ) {
        return
      }
      
      const defaultDescriptors: OptionDescriptor[] = Array.isArray(descriptor.default)
        ? descriptor.default
        : [descriptor.default]
      // this.annotation[descriptor.name] = {}

      const defaultValues = defaultDescriptors.map((defaultValue) => {
        if (isDefinedCondition(defaultValue)) {
          if (this.isOptionDefined(defaultValue.option)) {
            // this.annotation[descriptor.name].default = `By default if \`${defaultValue.option}\` is defined.`
            return defaultValue.conditions.defined
          } else if (defaultValue.conditions.notDefined !== undefined) {
            // this.annotation[descriptor.name].default = `By default if \`${defaultValue.option}\` is not defined.`
            return defaultValue.conditions.notDefined
          }
        } else if (isMultipleCondition(defaultValue)) {
          const relatedOptionValue = this.getDefinedValue(defaultValue.option, descriptor.inRoot) 
          const suitablePair = defaultValue.conditions.values.find((value) => {
            return value[0] === relatedOptionValue
          })

          if (suitablePair === undefined) {
            if (defaultValue.conditions.otherwise !== undefined) {
              // this.annotation[descriptor.name].default = `By default if \`${defaultValue.option}\` is none of ${defaultValue.conditions.values.join(', ')} values.`
              return defaultValue.conditions.otherwise
            }
          } else {
            // this.annotation[descriptor.name].default = `By default depends on \`${defaultValue.option}\` value`
            return suitablePair[1]
          }
        } else {
          // this.annotation[descriptor.name].default = 'Default value'
          return defaultValue
        }
      })

      const mergedValue = this.mergeDefaultValuePieces(defaultValues)
      this.defineOption(descriptor.name, mergedValue, descriptor.inRoot)
    })

    return this.resultConfig
  }

  private isOptionDefined(key: string, searchInRoot = false): boolean {
    // todo fix keyof TsConfig
    return this.getDefinedValue(key, searchInRoot) !== undefined
  }

  private getDefinedValue(key: string, searchInRoot = false): unknown {
    if (searchInRoot) {
      return this.resultConfig[key as keyof TsConfig]
    } else {
      return this.resultConfig.compilerOptions[key as keyof TsConfig]
    }
  }

  private defineOption(key: string, value: any, defineInRoot = false): void {
    if (defineInRoot) {
      this.resultConfig[key as keyof TsConfig] = value
    } else {
      this.resultConfig.compilerOptions[key as keyof TsConfig] = value
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


