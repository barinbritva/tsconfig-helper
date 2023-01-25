import {CompilerOptionName} from './CompilerOptionName'

type RootOptionName = 'files' | 'include' | 'exclude' | 'extends' | 'references'
type TypeAcquisition = 'enable' | 'include' | 'exclude' | 'disableFilenameBasedTypeAcquisition'
type ConfigOption = CompilerOptionName | RootOptionName | TypeAcquisition

export {
  CompilerOptionName,
  RootOptionName,
  ConfigOption
}
