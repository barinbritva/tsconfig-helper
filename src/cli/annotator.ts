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
    const annotationPairs = Object.entries(this.annotations)

    annotationPairs.forEach((annotationPair) => {
      const [optionToAnnotate, annotationsToAdd] = annotationPair
      const searchOptionLine = new RegExp(`$[\\s]*"${optionToAnnotate}":`, 'm')
      const optionMatch = config.match(searchOptionLine)

      if (optionMatch == null) {
        return
      }

      const matchedLine = optionMatch[0]
      const commentIndent = matchedLine.substr(0, matchedLine.indexOf(`"${optionToAnnotate}"`))

      const annotations: string[] = []
      if (annotationsToAdd.default !== undefined) {
        annotations.push(annotationsToAdd.default)
      }
      if (annotationsToAdd.deprecation !== undefined) {
        annotations.push(annotationsToAdd.deprecation)
      }

      const annotationComments = annotations.reduce(
        (accumulator, comment) => {
          return accumulator + commentIndent + '// ' + comment
        },
        ''
      )

      config = config.replace(matchedLine, annotationComments + matchedLine)
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

      if (option != null) {
        if (this.annotations[option.name] == null) {
          this.annotations[option.name] = {}
        }

        this.addDefaultAnnotation(option)
        this.addDeprecationAnnotation(option)
      }
    })
  }
  
  private addDefaultAnnotation(option: OptionDescriptor): void {
    if (this.isOptionDefined(this.originalConfig, option)) {
      return
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

  private addDeprecationAnnotation(option: OptionDescriptor): void {
    if (option.deprecated) {
      const description = typeof option.deprecated === 'string'
        ? `, use \`${option.deprecated}\` instead`
        : ''
      this.annotations[option.name].deprecation = 'Deprecated' + description
    }
  }

  private stringifyDefaultValue(descriptor: DefaultDescriptor): string {
    if (isDefinedCondition(descriptor)) {
      const endPart = descriptor.conditions.notDefined === undefined
        ? ''
        : ` else ${this.valueToString(descriptor.conditions.notDefined)}`

      return `if \`${this.valueToString(descriptor.option)}\` is defined then ` +
        `${this.valueToString(descriptor.conditions.defined)}${endPart}`
    } else if (isMultipleCondition(descriptor)) {
      const simplifiedConditions: {value: unknown, cases: unknown[]}[] = []
      descriptor.conditions.values.forEach((value) => {
        const foundValue = simplifiedConditions.find((simplifiedValue) => {
          return simplifiedValue.value === value[1]
        })

        if (foundValue) {
          foundValue.cases.push(value[0])
        } else {
          simplifiedConditions.push({value: value[1], cases: [value[0]] })
        }
      })

      let line = `if \`${descriptor.option}\` is equal `
      line += simplifiedConditions.map((condition) => {
        return `${this.arrayToString(condition.cases)} then \`${this.valueToString(condition.value)}\``
      }).join(', ')
      line += ` else \`${this.valueToString(descriptor.conditions.otherwise) ?? 'none'}\``

      return line
    } else {
      return this.valueToString(descriptor.value)
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
