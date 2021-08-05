import {ConfigOption} from './tsconfig'

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

export type Default = DefaultDefinedCondition | DefaultMultipleCondition | string

export enum RelationType {
  // enables other flag
  Enables = 'enables',
  // changes value of other flag if it is not specified
  Changes = 'changes',
  // modifies some part of value, for example adds something to arrays
  Modifies = 'modifies',
  // needs in other flag enabled to work properly
  Needs = 'needs',
  // replace because other flag is deprecated
  Replaces = 'replaces',
  // just somehow related
  Related = 'related'
}

export interface Relation {
  to: ConfigOption
  type: RelationType
  description: string
}

export interface BackRelation {
  to: ConfigOption
  look: RelationType
  description?: string
}

export interface OptionDescriptor {
  name: ConfigOption
  type: string
  brief: string
  hints?: Hint[]
  allowedValues?: string[]
  default?: Default | Default[]
  relations?: (Relation|BackRelation)[]
  codeExample?: string
  isDeprecated?: boolean
  description?: string
}

export type OptionMap = Partial<Record<ConfigOption, OptionDescriptor>>
