import {ConfigOption} from './tsconfig'
import {OptionDescriptor} from './interfaces'

export interface Hint {
  brief: string
  text?: string
}

export type DefaultDefinedCondition = {
  option: ConfigOption,
  conditions: {
    defined: unknown
    notDefined?: unknown
  }
}

export type DefaultMultipleCondition = {
  option: ConfigOption,
  conditions: {
    values: [unknown, unknown][]
    otherwise?: unknown
  }
}

export type DefaultDescriptor = DefaultDefinedCondition | DefaultMultipleCondition | unknown

export type OptionMap = Partial<Record<ConfigOption, OptionDescriptor>>
