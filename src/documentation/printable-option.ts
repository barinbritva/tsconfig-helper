import {OptionDescriptor} from '../shared/interfaces'
import {DefaultDescriptor} from '../shared/types'
import {isDefinedCondition, isMultipleCondition} from '../shared/utils'
import {MarkdownHelper as Markdown} from './markdown-helper'

export class PrintableOption {
  private static undefinedSymbol = 'none'
  constructor(private option: OptionDescriptor) {}

  get originalName(): string {
    return this.option.name
  }

  get name(): string {
    return Markdown.compileAsCodeBlock(this.option.name)
  }

  get type(): string {
    return Markdown.compileAsCodeBlock(this.option.type)
  }

  get brief(): string {
    return Markdown.compile(this.option.brief)
  }

  get allowedTypes(): string {
    if (this.option.allowedValues === undefined) {
      return ''
    }

    return Markdown.compile(this.option.allowedValues
      .map((value) => {
        return '`' + value + '`'
      })
      .join(', ')
    )
  }

  // todo merge the same values
  get defaultValue(): string {
    const option = this.option
    let value = ''

    if (option.default == undefined) {
      value = Markdown.wrapCodeBlock(PrintableOption.undefinedSymbol)
    } else if (Array.isArray(option.default)) {
      value = option.default
        .map((item) => {
          return this.stringifyDefaultValue(item)
        })
        .join(', ')
    } else {
      value = this.stringifyDefaultValue(option.default)
    }

    return Markdown.compile(value)
  }

  get hints(): string[] {
    if (this.option.hints === undefined) {
      return []
    }

    return this.option.hints.map((hint) => {
      const value = Array.isArray(hint) ? hint[0] + hint[1] : hint
      return Markdown.compile(value)
    })
  }

  get relations() {
    return this.option.relations
  }

  get isDeprecated(): boolean {
    return this.option.isDeprecated ?? false
  }

  private stringifyDefaultValue(value: DefaultDescriptor): string {
    if (isDefinedCondition(value)) {
      const endPart = value.conditions.notDefined === undefined
        ? ''
        : ` else ${this.stringifyValueCommand(value.conditions.notDefined)}`

      return `if \`${value.option}\` is defined then ` +
        `${this.stringifyValueCommand(value.conditions.defined)}${endPart}`
    } else if (isMultipleCondition(value)) {
      let line = `if \`${value.option}\` is equal `
      line += value.conditions.values.map((pair) => {
        return `\`${pair[0]}\` then \`${pair[1]}\``
      }).join(', ')
      line += ` else \`${value.conditions.otherwise ?? PrintableOption.undefinedSymbol}\`.`

      return line
    } else {
      return value
    }
  }

  // todo put command in data
  private stringifyValueCommand(value: string): string {
    if (value.indexOf('add:') === -1) {
      return '`' + value + '`'
    }
  
    return value.replace('add:', 'adds value of ').replace(/%/g, '`')
  }
}
