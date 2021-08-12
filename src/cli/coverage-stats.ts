import {getData} from '../shared/data'
import {ConfigOption} from '../shared/tsconfig'
import {getFlagList} from './flag-list'

export abstract class CoverageStats {
  public static show(): string {
    const configDescriptor = getData()
    const flagList = getFlagList()

    const descriptorKeys = Object.keys(configDescriptor) as ConfigOption[]
    const percentage = descriptorKeys.length * 100 / flagList.length

    return `Supported ${percentage}% of options / ` +
      `${descriptorKeys.length} from ${flagList.length}.`
  }
} 
