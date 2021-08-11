import {ConfigOption} from './tsconfig'
import {OptionDescriptor} from './interfaces'

export interface Hint {
  brief: string
  text?: string
}

export interface DefaultDefinedCondition {
  option: ConfigOption,
  conditions: {
    defined: unknown
    notDefined?: unknown
  }
}

export interface DefaultMultipleCondition {
  option: ConfigOption,
  conditions: {
    values: [unknown, unknown][]
    otherwise?: unknown
  }
}

export type DefaultDescriptor = DefaultDefinedCondition | DefaultMultipleCondition | unknown

export type OptionMap = Partial<Record<ConfigOption, OptionDescriptor>>
