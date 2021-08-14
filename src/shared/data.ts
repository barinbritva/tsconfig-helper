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
          // picked from https://github.com/microsoft/TypeScript/blob/main/src/compiler/utilitiesPublic.ts
          // function getDefaultLibFileName
          conditions: {
            values: [
              [
                'ES6',
                [
                  "ES2015",
                  "DOM",
                  "DOM.Iterable",
                  "WebWorker.ImportScripts",
                  "ScriptHost"
                ]
              ],
              [
                'ES2015',
                [
                  "ES2015",
                  "DOM",
                  "DOM.Iterable",
                  "WebWorker.ImportScripts",
                  "ScriptHost"
                ]
              ],
              [
                'ES7',
                [
                  "ES2016",
                  "DOM",
                  "DOM.Iterable",
                  "WebWorker.ImportScripts",
                  "ScriptHost"
                ]
              ],
              [
                'ES2016',
                [
                  "ES2016",
                  "DOM",
                  "DOM.Iterable",
                  "WebWorker.ImportScripts",
                  "ScriptHost"
                ]
              ],
              [
                'ES2017',
                [
                  "ES2017",
                  "DOM",
                  "DOM.Iterable",
                  "WebWorker.ImportScripts",
                  "ScriptHost"
                ]
              ],
              [
                'ES2018',
                [
                  "ES2018",
                  "DOM",
                  "DOM.Iterable",
                  "WebWorker.ImportScripts",
                  "ScriptHost"
                ]
              ],
              [
                'ES2019',
                [
                  "ES2019",
                  "DOM",
                  "DOM.Iterable",
                  "WebWorker.ImportScripts",
                  "ScriptHost"
                ]
              ],
              [
                'ES2020',
                [
                  "ES2020",
                  "DOM",
                  "DOM.Iterable",
                  "WebWorker.ImportScripts",
                  "ScriptHost"
                ]
              ],
              [
                'ES2021',
                [
                  "ES2021",
                  "DOM",
                  "DOM.Iterable",
                  "WebWorker.ImportScripts",
                  "ScriptHost"
                ]
              ],
              [
                'ESNext',
                [
                  "ESNext",
                  "DOM",
                  "DOM.Iterable",
                  "WebWorker.ImportScripts",
                  "ScriptHost"
                ]
              ]
            ],
            otherwise: [
              "ES5",
              "DOM",
              "WebWorker.ImportScripts",
              "ScriptHost"
            ]
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
