import {CompilerOptionName} from './CompilerOptionName'

type RootOptionName = 'files' | 'include' | 'exclude' | 'extends' | 'references'
type ConfigOption = CompilerOptionName | RootOptionName

export {
  CompilerOptionName,
  RootOptionName,
  ConfigOption
}
