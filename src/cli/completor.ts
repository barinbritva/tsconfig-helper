import {getData} from '../shared/data'
import {DefaultDescriptor, OptionMap} from '../shared/types'
import {isDefinedCondition, isMultipleCondition} from '../shared/utils'
import {TsConfig} from './interfaces'

export class Completor {
  private resultConfig: TsConfig
  private configDescriptor: OptionMap

  constructor(private originalConfig: TsConfig, private omitEmptyValues = false) {
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
      // todo remove block after refactoring of sections
      if (descriptor.section != null) {
        return
      }

      if (descriptor.cliOnly) {
        return
      }

      if (descriptor.deprecated) {
        return
      }

      if (
        descriptor.default === undefined ||
        this.isOptionDefined(descriptor.name, descriptor.inRoot)
      ) {
        return
      }
      
      const defaultDescriptors: DefaultDescriptor[] = Array.isArray(descriptor.default)
        ? descriptor.default
        : [descriptor.default]

      const defaultValues = defaultDescriptors.map((defaultValue) => {
        if (isDefinedCondition(defaultValue)) {
          if (this.lookupDefinedValue(defaultValue.option) !== undefined) {
            return defaultValue.conditions.defined
          } else if (defaultValue.conditions.notDefined !== undefined) {
            return defaultValue.conditions.notDefined
          }
        } else if (isMultipleCondition(defaultValue)) {
          const relatedOptionValue = this.getDefinedValue(defaultValue.option, descriptor.inRoot) 
          const suitablePair = defaultValue.conditions.values.find((value) => {
            // to remove difference between such values as es5/ES5
            if (typeof value[0] === 'string' && typeof relatedOptionValue === 'string') {
              return value[0].toLowerCase() === relatedOptionValue.toLowerCase()
            } else {
              return value[0] === relatedOptionValue
            }
          })

          if (suitablePair === undefined) {
            if (defaultValue.conditions.otherwise !== undefined) {
              return defaultValue.conditions.otherwise
            }
          } else {
            return suitablePair[1]
          }
        } else {
          return defaultValue.value
        }
      })

      // if omit mode and value is false or an empty array - don't add it
      if (this.omitEmptyValues && defaultValues.length === 1) {
        if (
          defaultValues[0] === false ||
          (Array.isArray(defaultValues[0]) && defaultValues[0].length === 0)) {
            return
        }
      }

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

  // todo check for the same option names in root and compilerOptions
  private lookupDefinedValue(key: string): unknown {
    return this.getDefinedValue(key, true) ?? this.getDefinedValue(key, false)
  }

  private processDynamicValuesIfNeeded(value: unknown): unknown {
    if (typeof value === 'string') {
      const dynamicValueRegexp = /%(\w*)%/
      const match = value.match(dynamicValueRegexp)

      if (match != null) {
        return value.replace(match[0], String(this.lookupDefinedValue(match[1])))
      }

      return value
    }

    return value
  }

  private mergeDefaultValuePieces(pieces: unknown[]): unknown {
    if (pieces.length === 1) {
      return this.processDynamicValuesIfNeeded(pieces[0])
    }

    const mergedValues: unknown[] = []
    pieces.forEach((piece) => {
      if (piece === undefined) {
        return
      }

      if (Array.isArray(piece)) {
        mergedValues.push(
          ...piece.map((item) => {
            return this.processDynamicValuesIfNeeded(item)
          })
        )
      } else {
        // if other cases appear, improve the logic
        throw new Error('Value merging are available only for arrays. Given: ' + pieces.join(', '))
      }
    })

    return mergedValues
  }
}
