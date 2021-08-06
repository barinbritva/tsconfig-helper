import {ConfigOption} from './tsconfig'
import {OptionDescriptor} from './interfaces'

export type Hint = ['+' | '-', string] | string

export type DefaultDefinedCondition = {
  option: ConfigOption,
  conditions: {
    defined: string
    notDefined?: string
  }
}

export type DefaultMultipleCondition = {
  option: ConfigOption,
  conditions: {
    values: [string, string][]
    otherwise?: string
  }
}

export type DefaultDescriptor = DefaultDefinedCondition | DefaultMultipleCondition | string

export type OptionMap = Partial<Record<ConfigOption, OptionDescriptor>>