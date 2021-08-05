import {RelationType} from './enums'
import {DefaultDescriptor, Hint} from './types'
import {ConfigOption} from './tsconfig'

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
  allowedValues?: string[]
  default?: DefaultDescriptor | DefaultDescriptor[]
  hints?: Hint[]
  relations?: (Relation|BackRelation)[]
  codeExample?: string
  isDeprecated?: boolean
  // description?: string
}
