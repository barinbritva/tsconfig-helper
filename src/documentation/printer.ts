import { OptionDescriptor } from '../shared/interfaces'
import {OptionMap} from '../shared/types'
import {isBackRelation, isDirectRelation} from '../shared/utils'
import {PrintableOption} from './printable-option'

export class Printer {
  public readonly options: Map<string, PrintableOption>

  constructor(data: OptionMap) {
    this.options = this.constructOptions(data)
  }

  private constructOptions(data: OptionMap) {
    const options = new Map()

    const rawOptions = Object.entries(data)
    for (const [key, option] of rawOptions) {
      options.set(key, new PrintableOption(this.linkRelations(data, option)))
    }

    return options
  }

  private linkRelations(data: OptionMap, option: OptionDescriptor): OptionDescriptor {
      if (option.relations != null) {
        option.relations.forEach((relation, index) => {
          if (isBackRelation(relation)) {
            const referencedOption = data[relation.to]
            if (referencedOption != null && referencedOption.relations != null) {
              const referencedRelation = referencedOption.relations.find((relationToCheck) => {
                if (!isDirectRelation(relationToCheck)) {
                  return false
                }

                return relationToCheck.to === option.name && relationToCheck.type === relation.look
              })

              if (referencedRelation != null && referencedRelation.description != null && option.relations != null) {
                option.relations[index].description = referencedRelation.description
              } 
            }
          }
        })
      }

    return option
  }

  // private linkRelations(data: OptionMap): OptionMap {
  //   const options = Object.entries(data)

  //   for (const [key, option] of options) {
  //     if (option.relations != null) {
  //       option.relations.forEach((relation, index) => {
  //         if (isBackRelation(relation)) {
  //           const referencedOption = data[relation.to]
  //           if (referencedOption != null && referencedOption.relations != null) {
  //             const referencedRelation = referencedOption.relations.find((relationToCheck) => {
  //               if (!isDirectRelation(relationToCheck)) {
  //                 return false
  //               }

  //               return relationToCheck.to === option.name && relationToCheck.type === relation.look
  //             })

  //             if (referencedRelation != null && referencedRelation.description != null && option.relations != null) {
  //               option.relations[index].description = referencedRelation.description
  //             } 
  //           }
  //         }
  //       })
  //     }

  //     data[key as ConfigOption] = option
  //   }

  //   return data
  // }
}
