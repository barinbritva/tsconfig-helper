import { RelationType } from './enums'
import {OptionMap} from './types'

export function getData(): OptionMap {
  return {
    'files': {
      inRoot: true,
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
      inRoot: true,
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
      inRoot: true,
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
