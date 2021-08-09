import fs from 'fs'
import path from 'path'
import {OptionDescriptor} from '../shared/interfaces'
import {DefaultDescriptor, Hint} from '../shared/types'
import {isBackRelation, isDefinedCondition, isDirectRelation, isMultipleCondition} from '../shared/utils'
import {MarkdownHelper as Markdown} from './markdown-helper'
import {PrintableRelation} from './interfaces'
import { RelationType } from '../shared/enums'

export class PrintableOption {
  private static undefinedSymbol = 'none'
  private static examplesPath = '../../src/shared'
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

  get hints(): Hint[] {
    if (this.option.hints === undefined) {
      return []
    }

    return this.option.hints.map((hint) => {
      return {
        brief: Markdown.compile(hint.brief),
        text: hint.text === undefined
          ? ''
          : Markdown.compile(this.readHintText(hint.text))
      }
    })
  }

  get relations(): PrintableRelation[] {
    if (this.option.relations === undefined) {
      return []
    }

    return this.option.relations.map((relation) => {
      const relationType = isDirectRelation(relation) ? relation.type : relation.look
      
      return {
        to: relation.to,
        description: relation.description ?? '',
        ...this.getRelationIcon(relationType, isBackRelation(relation))
      }
    })
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

  private getRelationIcon(relationType: RelationType, isBackRelation: boolean): { caption: string, icon: string } {    
    switch(relationType) {
      case RelationType.Enables:
        return {
          icon: isBackRelation ? 'enabled-by' : 'enables',
          caption: isBackRelation ? 'enabled by' : 'enables'
        }
      case RelationType.Modifies:
        return {
          icon: isBackRelation ? 'modified-by' : 'modifies',
          caption: isBackRelation ? 'modified by' : 'modifies'
        }
      case RelationType.Related:
        return {
          icon: 'related',
          caption: 'related'
        }
      case RelationType.Changes:
        return {
          icon: 'related',
          caption: isBackRelation ? 'changed by' : 'changes'
        }
      case RelationType.Needs:
        return {
          icon: 'related',
          caption: isBackRelation ? 'needed by' : 'needs'
        }
      case RelationType.Replaces:
        return {
          icon: 'related',
          caption: isBackRelation ? 'replaced by' : 'replaces'
        }
    }
  }

  private readHintText(filePath: string): string {
    const fullPath = path.resolve(__dirname, PrintableOption.examplesPath, filePath)
    const content = fs.readFileSync(fullPath, {encoding: 'utf8'})
    return content
  }
}
