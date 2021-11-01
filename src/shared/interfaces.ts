import {RelationType} from './enums'
import {ConfigSection, DefaultDescriptor} from './types'
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
  inRoot?: boolean
  default?: DefaultDescriptor | DefaultDescriptor[]
  deprecated?: true | ConfigOption
  cliOnly?: boolean
  section?: ConfigSection
}
