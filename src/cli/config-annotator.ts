import {OptionAnnotation} from './interfaces'
import {DefaultDescriptor} from '../shared/types'
import {OptionDescriptor} from '../shared/interfaces'
import {isDefinedCondition, isMultipleCondition} from '../shared/utils'

export class ConfigAnnotator {
  private annotations: Record<string, OptionAnnotation> = {}
  
  public addDefaultAnnotation(option: OptionDescriptor) {
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

    this.annotations[option.name].default = value
  }

  public addCommentsToConfig(config: string): string {
    const annotations = Object.entries(this.annotations)
    annotations.forEach((annotation) => {
      const [optionToAnnotate] = annotation
      const regex = new RegExp(`$[\\s]*"${optionToAnnotate}":`, 'm')
      const match = config.match(regex)

      if (match == null) {
        return
      }

      const commentIndent = match[0].substr(0, match[0].indexOf(`"${optionToAnnotate}"`))
      config = config.replace(match[0], commentIndent + '// ' + annotation[1].default + match[0])
    })

    return config
  }

  private stringifyDefaultValue(value: DefaultDescriptor): string {
    if (isDefinedCondition(value)) {
      const endPart = value.conditions.notDefined === undefined
        ? ''
        : ` else ${value.conditions.notDefined}`

      return `if \`${value.option}\` is defined then ` +
        `${value.conditions.defined}${endPart}`
    } else if (isMultipleCondition(value)) {
      let line = `if \`${value.option}\` is equal `
      line += value.conditions.values.map((pair) => {
        return `\`${pair[0]}\` then \`${pair[1]}\``
      }).join(', ')
      line += ` else \`${value.conditions.otherwise ?? 'none'}\``

      return line
    } else {
      return String(value)
    }
  }
}
