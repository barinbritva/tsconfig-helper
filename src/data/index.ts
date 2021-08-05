import marked from 'marked'
import {BackRelation, Default, DefaultDefinedCondition, DefaultMultipleCondition, OptionDescriptor, OptionMap, Relation, RelationType} from '../OptionDescriptor'
import {ConfigOption} from '../tsconfig'

function isBackRelation(value: Relation | BackRelation): value is BackRelation {
  if ('to' in value && 'look' in value) {
    return true
  }

  return false
}

function isDirectRelation(value: Relation | BackRelation): value is Relation {
  if ('to' in value && 'type' in value) {
    return true
  }

  return false
}

export function getRawData(): OptionMap {
  return {
    'files': {
      name: 'files',
      type: 'string[]',
      brief: 'Include specific file list.',
      hints: [
        'An error occurs if any of the files can\'t be found.',
        'All files are imported inside of specified files will be compiled too.',
        ['+', 'All files are not included to compilation will be fully ignored by compiler.'],
        ['-', 'Not an option if you are using additional tools for build process like bundlers. Use `include` instead.'] // check
      ],
      relations: [
        {
          type: RelationType.Related,
          to: 'include',
          description: 'Option `include` may be used instead to not enumerate all files manually.'
        },
        {
          to: 'include',
          look: RelationType.Modifies
        },
      ]
    },
  
    'include': {
      name: 'include',
      type: 'string[]',
      default: {
        option: 'files',
        conditions: {
          defined: '[]',
          notDefined: '["**/*"]'
        }
      },
      brief: 'Bunch file include using glob patterns.',
      hints: [
        'It\'s just shortcut for `files`. Technically, this options are used to fill `files` options.',
        'Include all files even though they aren\'t used in the program.',
        'If a glob pattern doesn\'t include a file extension, then it will be defaults: `.ts`, `.tsx`, and `.d.ts`.',
        'If `allowJs` are enabled, it adds `.js` and `.jsx` to defaults of glob pattern.',
        ['+', 'Right option to work with different bundlers.'] // check
      ],
      relations: [
        {
          type: RelationType.Modifies,
          to: 'files',
          description: 'When both options `files` and `includes` are enabled, them values merge.'
        },
        {
          type: RelationType.Related,
          to: 'files',
          description: 'Option `files` may be used instead if you have one or a couple entrance points such as index.ts, server.ts, etc.'
        },
        {
          to: 'exclude',
          look: RelationType.Modifies
        }
      ]
    },
  
    'exclude': {
      name: 'exclude',
      type: 'string[]',
      default: [
        '["node_modules", "bower_components", "jspm_packages"]', // check
        {
          option: 'outDir',
          conditions: {
            defined: 'add:%outDir%',
            // notDefined: 'null'
          }
        },
        {
          option: 'declarationDir',
          conditions: {
            defined: 'add:%declarationDir%',
            // notDefined: 'null'
          }
        }
      ],
      brief: 'Exclude some glob patterns which was already added by `include`.',
      relations: [
        {
          type: RelationType.Modifies,
          to: 'include',
          description: 'Option `exclude` defines what path patterns will be excluded from `include` patterns.'
        }
      ],
      hints: [
        ['-', 'Can only exclude file paths defined in `include`.'],
        ['-', 'Can not have impact to `files` directive.'],
        ['-', 'Can not exclude file if it\'s imported in other file which is included.'],
        ['-', 'Once you declared `exclude` explicitly all the default values should be added manually if it\'s necessary.']
      ]
    },
  
    'target': {
      name: 'target',
      brief: 'Set the ECMAScript version for emitted JavaScript.',
      type: 'enum',
      allowedValues: ['ES3', 'ES5', 'ES6', 'ES2015', 'ES7', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', 'ESNext'],
      default: 'ES3',
      relations: [
        {
          type: RelationType.Changes,
          to: 'module',
          description: 'By default `module` is set depending on value of `target`' // specify
        },
        {
          type: RelationType.Changes,
          to: 'lib',
          description: 'By default `lib` is set depending on value of `target`' // specify
        },
      ],
    },
    
    'module': {
      name: 'module',
      brief: 'Sets the module system for the program.',
      type: 'enum',
      allowedValues: ['CommonJS', 'ES6', 'ES2015', 'ES2020', 'None', 'UMD', 'AMD', 'System', 'ESNext'],
      default: {
        option: 'target',
        conditions: {
          values: [
            ['ES3', 'CommonJS'],
            ['ES5', 'CommonJS'],
            ['ES6', 'ES6'],
            ['ES2015', 'ES2015'],
          ],
          otherwise: 'ESNext' // check
        }
      },
      relations: [
        {
          type: RelationType.Changes,
          to: 'moduleResolution',
          description: 'By default `module` changes `moduleResolution`.' // specify
        },
        {
          look: RelationType.Changes,
          to: 'target'
        }
      ]
    },
  
    'moduleResolution': {
      name: 'moduleResolution',
      brief: 'Specify how TypeScript looks up a file from a given module specifier.',
      type: 'enum',
      allowedValues: ['Classic', 'Node'],
      hints: [
        'In most cases you won\'t need to use `Classic` in modern code.',
        'It makes sense to always set it up to `Node` manually.'
      ],
      default: {
        option: 'module',
        conditions: {
          values: [
            ['AMD', 'Classic'],
            ['UMD', 'Classic'],
            ['System', 'Classic']
            // check ES6
          ],
          otherwise: 'Node'
        }
      },
      relations: [
        {
          look: RelationType.Changes,
          to: 'module'
        }
      ]
    },
  
    'lib': {
      name: 'lib',
      brief: 'Specify what bundled library declaration files will be included.',
      type: 'enum[]',
      allowedValues: ['ES5', 'ES6'], // todo
      hints: [
        ['+', 'It\'s able to include whole EcmaScript standards or its some parts.'],
        ['-', 'It adds only type definitions, not polyfills. If you add some `lib` from higher standard to lower you have to manually add polyfills for it.'],
        ['-', 'Once you declared `lib` explicitly all the default values should be added manually if it\'s necessary.']
      ],
      relations: [
        {
          look: RelationType.Changes,
          to: 'target'
        }
      ]
    }
  }
}

export function getNormalizedData(): OptionMap {
  const data = getRawData()
  const options = Object.entries(data)

  // normalize relations
  for (const [key, option] of options) {
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

    data[key as ConfigOption] = option
  }

  return data
}

type Stringable<T> = {
  [P in keyof T]: T[P] | string
}

type StringableOptionMap = Partial<Record<ConfigOption, Stringable<OptionDescriptor>>>

export function prepareToPrint(data: OptionMap): StringableOptionMap {
  let preparedData: StringableOptionMap = {}
  preparedData = Object.assign({}, data)
  const options = Object.entries(data)

  for (const [key, option] of options) {
    // todo fix this line
    const optionToPrepare = preparedData[key as ConfigOption]!
    optionToPrepare.type = markdownIt(option.type)
    optionToPrepare.name = markdownIt(option.name)
    optionToPrepare.brief = marked(option.brief)

    if (option.default != null) {
      optionToPrepare.default = marked(stringifyOptionDefault(option))
    }

    if (option.allowedValues != null) {
      optionToPrepare.allowedValues = marked(option.allowedValues
        .map((value) => {
          return '`' + value + '`'
        })
        .join(', ')
      )
    }

    if (option.hints != null) {
      optionToPrepare.hints = option.hints.map((hint) => {
        if (Array.isArray(hint)) {
          return marked(hint[0] + hint[1])
        } else {
          return marked(hint)
        }
      })
    }

    if (option.relations != null) {
      optionToPrepare.relations = option.relations.map((relation) => {
        // relation.to = markdownIt(relation.to)
        if (relation.description != null) {
          relation.description = marked(relation.description)
        }
        return relation
      })
    }
  }

  return preparedData
}

function markdownIt<T>(value: T) {
  return marked('`' + value + '`')
}

export function stringifyOptionDefault(option: OptionDescriptor): string {
  const printItem = (value: Default): string => {
    if (isDefinedCondition(value)) {
      const endPart = value.conditions.notDefined === undefined ? '' : ` else ${parseValueCommand(value.conditions.notDefined)}`
      return `if \`${value.option}\` is defined then ${parseValueCommand(value.conditions.defined)}${endPart}`
    } else if (isMultipleCondition(value)) {
      let line = `if \`${value.option}\` is equal `
      line += value.conditions.values.map((pair) => {
        return `\`${pair[0]}\` then \`${pair[1]}\``
      }).join(', ')
      line += ` else \`${value.conditions.otherwise ?? 'none'}\`.`
      return line
    } else {
      return value
    }
  }

  if (option.default == null) {
    return 'none'
  }

  if (Array.isArray(option.default)) {
    return option.default
      .map((item) => {
        return printItem(item)
      })
      .join(', ')
  } else {
    return printItem(option.default)
  }
}

function parseValueCommand(value: string): string {
  if (value.indexOf('add:') === -1) {
    return '`' + value + '`'
  }

  return value.replace('add:', 'adds value of ').replace(/%/g, '`')
}

function isMultipleCondition(value: Default): value is DefaultMultipleCondition {
  if (typeof value === 'string') {
    return false
  }

  if ('values' in value.conditions) {
    return true
  }

  return false
}

function isDefinedCondition(value: Default): value is DefaultDefinedCondition {
  if (typeof value === 'string') {
    return false
  }

  if ('defined' in value.conditions) {
    return true
  }

  return false
}
