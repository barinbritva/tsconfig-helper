import {CompilerOptions} from 'typescript'

export interface TsConfig {
  files?: string[]
  include?: string[]
  exclude?: string[]
  extends?: string
  // todo specify
  references?: any[]
  compilerOptions: CompilerOptions
}
