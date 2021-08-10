import {CompilerOptions} from 'typescript'

export interface TsConfig {
  files?: string[]
  include?: string[]
  exclude?: string[]
  extends?: string
  // todo specify
  references?: any[]
  // todo mark ?
  compilerOptions: CompilerOptions
}

export interface OptionAnnotation {
  default?: string
}
