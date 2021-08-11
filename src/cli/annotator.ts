import {DefaultDescriptor, OptionMap} from '../shared/types'
import {OptionDescriptor} from '../shared/interfaces'
import {isDefinedCondition, isMultipleCondition} from '../shared/utils'
import {getData} from '../shared/data'
import {OptionAnnotation, TsConfig} from './interfaces'
import {ConfigOption} from '../shared/tsconfig'
import {InputOutput} from './input-output'

export class Annotator {
  private configDescriptor: OptionMap
  private annotations: Record<string, OptionAnnotation> = {}

  constructor(private originalConfig: TsConfig, private resultConfig: TsConfig) {
    this.configDescriptor = getData()
    this.generateAnnotations()
  }

  public generateAnnotatedConfig(): string {
    let config = InputOutput.toString(this.resultConfig)
    const annotations = Object.entries(this.annotations)

    annotations.forEach((annotation) => {
      const [optionToAnnotate] = annotation
      const searchOptionLine = new RegExp(`$[\\s]*"${optionToAnnotate}":`, 'm')
      const match = config.match(searchOptionLine)

      if (match == null) {
        return
      }

      const commentIndent = match[0].substr(0, match[0].indexOf(`"${optionToAnnotate}"`))
      config = config.replace(match[0], commentIndent + '// ' + annotation[1].default + match[0])
    })

    return config
  }

  private generateAnnotations(): void {
    let resultConfigKeys = Object.keys(this.resultConfig)
    if (this.resultConfig.compilerOptions != null) {
      resultConfigKeys = resultConfigKeys.concat(Object.keys(this.resultConfig.compilerOptions))
    }

    resultConfigKeys.forEach((key) => {
      const option = this.configDescriptor[key as ConfigOption]

      if (
        option != null &&
        !this.isOptionDefined(this.originalConfig, option)
      ) {
        this.addDefaultAnnotation(option)
      }
    })
  }
  
  private addDefaultAnnotation(option: OptionDescriptor) {
    if (this.annotations[option.name] == null) {
      this.annotations[option.name] = {}
    }

    let value = ''

    if (option.default == undefined) {
      value = 'no value'
    } else if (Array.isArray(option.default)) {
      value = option.default
        .map((item) => {
          return this.stringifyDefaultValue(item)
        })
        .join(', ')
    } else {
      value = this.stringifyDefaultValue(option.default)
    }

    this.annotations[option.name].default = 'By default ' + value
  }

  private stringifyDefaultValue(value: DefaultDescriptor): string {
    if (isDefinedCondition(value)) {
      const endPart = value.conditions.notDefined === undefined
        ? ''
        : ` else ${this.valueToString(value.conditions.notDefined)}`

      return `if \`${this.valueToString(value.option)}\` is defined then ` +
        `${this.valueToString(value.conditions.defined)}${endPart}`
    } else if (isMultipleCondition(value)) {
      const simplifiedConditions: {value: unknown, cases: unknown[]}[] = []
      value.conditions.values.forEach((value) => {
        const foundValue = simplifiedConditions.find((simplifiedValue) => {
          return simplifiedValue.value === value[1]
        })

        if (foundValue) {
          foundValue.cases.push(value[0])
        } else {
          simplifiedConditions.push({value: value[1], cases: [value[0]] })
        }
      })

      let line = `if \`${value.option}\` is equal `
      line += simplifiedConditions.map((condition) => {
        return `${this.arrayToString(condition.cases)} then \`${this.valueToString(condition.value)}\``
      }).join(', ')
      line += ` else \`${this.valueToString(value.conditions.otherwise) ?? 'none'}\``

      return line
    } else {
      return this.valueToString(value)
    }
  }

  // todo here is similar logic as in config-completor.ts - unify
  private isOptionDefined(config: TsConfig, option: OptionDescriptor): boolean {
    if (option.inRoot) {
      return config[option.name as keyof TsConfig] !== undefined
    } else {
      return config.compilerOptions[option.name as keyof TsConfig] !== undefined
    }
  }

  private valueToString(value: unknown): string {
    if (Array.isArray(value)) {
      const prepared = value.map((item) => {
        // now only array of string exists, if other cases appear, improve the logic
        if (typeof item === 'string') {
          return `"${item}"`
        } else {
          return item
        }
      })
      return `[${prepared.join(', ')}]`
    } else {
      return String(value)
    }
  }

  private arrayToString(value: unknown[]): string {
    const stringifiedValue = '`' + value.join('`, `') + '`'

    if (value.length > 1) {
      const lastIndex = stringifiedValue.lastIndexOf(',')
      return  stringifiedValue.substring(0, lastIndex) +
        ' or' +
        stringifiedValue.substring(lastIndex + 1)
    } else {
      return stringifiedValue
    }
  }
}
