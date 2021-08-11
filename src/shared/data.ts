import {OptionMap} from './types'

export function getData(): OptionMap {
  return {
    'files': {
      inRoot: true,
      name: 'files'
    },
  
    'include': {
      inRoot: true,
      name: 'include',
      default: {
        option: 'files',
        conditions: {
          defined: [],
          notDefined: ["**/*"]
        }
      }
    },
  
    'exclude': {
      inRoot: true,
      name: 'exclude',
      default: [
        // todo check
        {value: ["node_modules", "bower_components", "jspm_packages"]},
        {
          option: 'outDir',
          conditions: {
            defined: ["%outDir%"],
          }
        },
        {
          option: 'declarationDir',
          conditions: {
            defined: ["%declarationDir%"],
          }
        }
      ]
    },
  
    'target': {
      name: 'target',
      default: {value: 'ES3'}
    },
    
    'module': {
      name: 'module',
      default: {
        option: 'target',
        conditions: {
          values: [
            ['ES3', 'CommonJS'],
            ['ES5', 'CommonJS'],
            ['ES6', 'ES6'],
            ['ES2015', 'ES2015'],
          ],
          // check
          otherwise: 'ESNext'
        }
      }
    },
  
    'moduleResolution': {
      name: 'moduleResolution',
      default: {
        option: 'module',
        conditions: {
          values: [
            ['AMD', 'Classic'],
            ['UMD', 'Classic'],
            ['System', 'Classic']
            // todo check ES6
          ],
          otherwise: 'Node'
        }
      }
    },
  
    'lib': {
      name: 'lib',
      default: [
        {
          option: 'target',
          // picked from TypeScript/src/compiler/utilitiesPublic.ts,
          // function getDefaultLibFileName
          conditions: {
            values: [
              ['ES6', ['lib.es6.d.ts']],
              ['ES2015', ['lib.es6.d.ts']],
              ['ES7', ['lib.es2016.full.d.ts']],
              ['ES2016', ['lib.es2016.full.d.ts']],
              ['ES2017', ['lib.es2017.full.d.ts']],
              ['ES2018', ['lib.es2018.full.d.ts']],
              ['ES2019', ['lib.es2019.full.d.ts']],
              ['ES2020', ['lib.es2020.full.d.ts']],
              ['ES2021', ['lib.es2021.full.d.ts']],
              ['ESNext', ['lib.esnext.full.d.ts']]
            ],
            otherwise: ['lib.d.ts']
          }
        },
        // todo implement prioritization
        // {
        //   option: 'noLib',
        //   conditions: {
        //     defined: []
        //   }
        // }
      ]
    },

    // todo noLib 

    'allowJs': {
      name: 'allowJs',
      default: {
        option: 'checkJs',
        conditions: {
          values: [
            [true, true]
          ],
          otherwise: false
        },
      }
    },

    'checkJs': {
      name: 'checkJs',
      default: {value: false}
    },

    // Deprecated flags

    'out': {
      name: 'out',
      deprecated: 'outDir'
    },

    'diagnostics': {
      name: 'diagnostics',
      deprecated: 'extendedDiagnostics'
    },

    'keyofStringsOnly': {
      name: 'keyofStringsOnly',
      deprecated: true
    },

    'charset': {
      name: 'charset',
      deprecated: true
    }
  }
}
