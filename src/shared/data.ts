import {OptionMap} from './types'

export function getData(): OptionMap {
  return {
    // Top Level section
    'files': {
      inRoot: true,
      name: 'files',
    },

    'extends': {
      inRoot: true,
      name: 'extends'
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

    'references': {
      inRoot: true,
      name: 'references'
    },

    // Type Checking section
    'allowUnreachableCode': {
      name: 'allowUnreachableCode',
      default: {
        value: undefined
      }
    },

    'allowUnusedLabels': {
      name: 'allowUnusedLabels',
      default: {
        value: undefined
      }
    },

    'alwaysStrict': {
      name: 'alwaysStrict',
      default: {
        option: 'strict',
        conditions: {
          values: [
            [true, true]
          ],
          otherwise: false
        }
      }
    },

    'exactOptionalPropertyTypes': {
      name: 'exactOptionalPropertyTypes',
      default: {
        value: false
      }
    },

    'noFallthroughCasesInSwitch': {
      name: 'noFallthroughCasesInSwitch',
      default: {
        value: false
      }
    },

    'noImplicitAny': {
      name: 'noImplicitAny',
      default: {
        option: 'strict',
        conditions: {
          values: [
            [true, true]
          ],
          otherwise: false
        }
      }
    },

    'noImplicitOverride': {
      name: 'noImplicitOverride',
      default: {
        value: false
      }
    },

    'noImplicitReturns': {
      name: 'noImplicitReturns',
      default: {
        value: false
      }
    },

    'noImplicitThis': {
      name: 'noImplicitThis',
      default: {
        option: 'strict',
        conditions: {
          values: [
            [true, true]
          ],
          otherwise: false
        }
      }
    },

    'noPropertyAccessFromIndexSignature': {
      name: 'noPropertyAccessFromIndexSignature',
      default: {
        value: false
      }
    },

    'noUncheckedIndexedAccess': {
      name: 'noUncheckedIndexedAccess',
      default: {
        value: false
      }
    },

    'noUnusedLocals': {
      name: 'noUnusedLocals',
      default: {
        value: false
      }
    },

    'noUnusedParameters': {
      name: 'noUnusedParameters',
      default: {
        value: false
      }
    },

    'strict': {
      name: 'strict',
      default: {
        value: false
      }
    },

    'strictBindCallApply': {
      name: 'strictBindCallApply',
      default: {
        option: 'strict',
        conditions: {
          values: [
            [true, true]
          ],
          otherwise: false
        }
      }
    },

    'strictFunctionTypes': {
      name: 'strictFunctionTypes',
      default: {
        option: 'strict',
        conditions: {
          values: [
            [true, true]
          ],
          otherwise: false
        }
      }
    },

    'strictNullChecks': {
      name: 'strictNullChecks',
      default: {
        option: 'strict',
        conditions: {
          values: [
            [true, true]
          ],
          otherwise: false
        }
      }
    },

    'strictPropertyInitialization': {
      name: 'strictPropertyInitialization',
      default: {
        option: 'strict',
        conditions: {
          values: [
            [true, true]
          ],
          otherwise: false
        }
      }
    },

    'useUnknownInCatchVariables': {
      name: 'useUnknownInCatchVariables',
      default: {
        option: 'strict',
        conditions: {
          values: [
            [true, true]
          ],
          otherwise: false
        }
      }
    },

    // Modules section
    'allowUmdGlobalAccess': {
      name: 'allowUmdGlobalAccess',
      default: {
        value: false
      }
    },

    'baseUrl': {
      name: 'baseUrl'
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

    'noResolve': {
      name: 'noResolve',
      default: {
        value: false
      }
    },

    'paths': {
      name: 'paths'
    },

    'resolveJsonModule': {
      name: 'resolveJsonModule',
      default: {
        value: false
      }
    },

    'rootDir': {
      name: 'rootDir'
      // todo check relation to composite option
    },

    'rootDirs': {
      name: 'rootDirs'
    },

    'typeRoots': {
      name: 'typeRoots',
      default: {
        // todo check
        value: ["./node_modules/@types"]
      }
    },

    'types': {
      name: 'types',
      // means it includes any folder from "./node_modules/@types" by default
    },

    // Emit section
    'declaration': {
      name: 'declaration',
      default: {
        option: 'composite',
        conditions: {
          values: [
            [true, true]
          ],
          otherwise: false
        }
      }
    },

    'declarationDir': {
      name: 'declarationDir'
    },

    'declarationMap': {
      name: 'declarationMap',
      default: {
        value: false
      }
    },

    'downlevelIteration': {
      name: 'downlevelIteration',
      default: {
        value: false
      }
    },

    'emitBOM': {
      name: 'emitBOM',
      default: {
        value: false
      }
    },

    'emitDeclarationOnly': {
      name: 'emitDeclarationOnly',
      default: {
        value: false
      }
    },

    'importHelpers': {
      name: 'importHelpers',
      default: {
        value: false
      }
    },

    'importsNotUsedAsValues': {
      name: 'importsNotUsedAsValues',
      default: {
        // values: remove, preserve, error
        // todo check
        value: 'remove'
      }
    },

    'inlineSourceMap': {
      name: 'inlineSourceMap',
      default: {
        value: false
      }
    },

    'inlineSources': {
      name: 'inlineSources',
      default: {
        value: false
      }
    },

    'mapRoot': {
      name: 'mapRoot',
    },

    'newLine': {
      name: 'newLine',
      // todo check if unix lf, other - crlf
      // values: crlf, lf
    },

    'noEmit': {
      name: 'noEmit',
      default: {
        value: false
      }
    },

    'noEmitHelpers': {
      name: 'noEmitHelpers',
      default: {
        value: false
      }
    },

    'noEmitOnError': {
      name: 'noEmitOnError',
      default: {
        value: false
      }
    },
    
    'outDir': {
      name: 'outDir'
    },

    'outFile': {
      name: 'outFile'
    },

    'preserveConstEnums': {
      name: 'preserveConstEnums',
      default: {
        value: false
      }
    },

    'preserveValueImports': {
      name: 'preserveValueImports',
      default: {
        value: false
      }
    },

    'removeComments': {
      name: 'removeComments',
      default: {
        value: false
      }
    },

    'sourceMap': {
      name: 'sourceMap',
      default: {
        value: false
      }
    },

    'sourceRoot': {
      name: 'sourceRoot',
    },

    'stripInternal': {
      name: 'stripInternal',
      default: {
        value: false
      }
    },

    // JavaScript Support section
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
      default: {
        value: false
      }
    },

    'maxNodeModuleJsDepth': {
      name: 'maxNodeModuleJsDepth',
      default: {
        value: 0
      }
    },

    // Editor Support section
    'disableSizeLimit': {
      name: 'disableSizeLimit',
      default: {
        value: false
      }
    },

    'plugins': {
      name: 'plugins'
    },

    // Interop Constraints section
    'allowSyntheticDefaultImports': {
      name: 'allowSyntheticDefaultImports',
      default: {
        option: 'module',
        conditions: {
          values: [
            ['System', true]
          ],
          // todo true if module is system, or esModuleInterop and module is not es6/es2015 or esnext, false otherwise.
          otherwise: false
        }
      }
    },

    'esModuleInterop': {
      name: 'esModuleInterop',
      default: {
        value: false
      }
    },

    'forceConsistentCasingInFileNames': {
      name: 'forceConsistentCasingInFileNames',
      default: {
        value: false
      }
    },

    'isolatedModules': {
      name: 'isolatedModules',
      default: {
        value: false
      }
    },

    'preserveSymlinks': {
      name: 'preserveSymlinks',
      default: {
        value: false
      }
    },

    // Backward Compatibility section
    'charset': {
      name: 'charset',
      default: {
        value: 'utf8'
      },
      deprecated: true
    },

    'keyofStringsOnly': {
      name: 'keyofStringsOnly',
      default: {
        value: false
      },
      deprecated: true
    },

    'noImplicitUseStrict': {
      name: 'noImplicitUseStrict',
      default: {
        value: false
      }
    },

    'noStrictGenericChecks': {
      name: 'noStrictGenericChecks',
      default: {
        value: false
      }
    },

    'out': {
      name: 'out',
      deprecated: 'outDir'
    },

    'suppressExcessPropertyErrors': {
      name: 'suppressExcessPropertyErrors',
      default: {
        value: false
      }
    },

    'suppressImplicitAnyIndexErrors': {
      name: 'suppressImplicitAnyIndexErrors',
      default: {
        value: false
      }
    },

    // Language and Environment section
    'emitDecoratorMetadata': {
      name: 'emitDecoratorMetadata',
      default: {
        value: false
      }
    },

    'experimentalDecorators': {
      name: 'experimentalDecorators',
      default: {
        value: false
      }
    },

    'jsx': {
      name: 'jsx',
      // allowed: preserve, react, react-native, react-jsx, react-jsxdev
    },

    'jsxFactory': {
      name: 'jsxFactory',
      default: {
        option: 'jsx',
        conditions: {
          defined: 'React.createElement'
        }
      }
    },

    'jsxFragmentFactory': {
      name: 'jsxFragmentFactory',
      default: {
        option: 'jsx',
        conditions: {
          defined: 'Fragment'
        }
      }
    },

    'jsxImportSource': {
      name: 'jsxImportSource',
      default: {
        option: 'jsx',
        conditions: {
          defined: 'react'
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
              // todo check fo 2022
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

    'noLib': {
      name: 'noLib',
      default: {
        value: false
      }
    },

    'reactNamespace': {
      name: 'reactNamespace',
      default: {
        option: 'jsx',
        conditions: {
          defined: 'React'
        }
      },
      deprecated: 'jsxFactory'
    },
  
    'target': {
      name: 'target',
      default: {
        value: 'ES3'
      }
    },

    'useDefineForClassFields': {
      name: 'useDefineForClassFields',
      default: {
        option: 'target',
        conditions: {
          values: [
            ['ES2022', true],
            ['ESNext', true],
          ],
          otherwise: false
        }
      }
    },

    // Compiler Diagnostics
    'diagnostics': {
      name: 'diagnostics',
      default: {
        value: false
      },
      deprecated: 'extendedDiagnostics'
    },

    'explainFiles': {
      name: 'explainFiles',
      default: {
        value: false
      }
    },

    'extendedDiagnostics': {
      name: 'extendedDiagnostics',
      default: {
        value: false
      }
    },

    'generateCpuProfile': {
      name: 'generateCpuProfile',
      default: {
        value: 'profile.cpuprofile'
      },
      // todo ignore option if cliOnly
      cliOnly: true
    },

    'listEmittedFiles': {
      name: 'listEmittedFiles',
      default: {
        value: false
      }
    },

    'listFiles': {
      name: 'listFiles',
      default: {
        value: false
      }
    },

    'traceResolution': {
      name: 'traceResolution',
      default: {
        value: false
      }
    },

    // Projects section
    'composite': {
      name: 'composite',
      default: {
        value: false
      }
    },

    'disableReferencedProjectLoad': {
      name: 'disableReferencedProjectLoad',
      default: {
        value: false
      }
    },

    'disableSolutionSearching': {
      name: 'disableSolutionSearching',
      default: {
        value: false
      }
    },

    'disableSourceOfProjectReferenceRedirect': {
      name: 'disableSourceOfProjectReferenceRedirect',
      default: {
        value: false
      }
    },

    'incremental': {
      name: 'incremental',
      default: {
        option: 'composite',
        conditions: {
          defined: true,
          notDefined: false
        }
      }
    },

    'tsBuildInfoFile': {
      name: 'tsBuildInfoFile',
      default: {
        option: 'incremental',
        conditions: {
          defined: '.tsbuildinfo'
        }
      }
    },

    // Output Formatting section
    'noErrorTruncation': {
      name: 'noErrorTruncation',
      default: {
        value: false
      }
    },

    'preserveWatchOutput': {
      name: 'preserveWatchOutput',
      default: {
        value: false
      }
    },

    'pretty': {
      name: 'pretty',
      default: {
        value: true
      }
    },

    // Completeness section
    'skipDefaultLibCheck': {
      name: 'skipDefaultLibCheck',
      default: {
        value: false
      },
      deprecated: 'skipLibCheck'
    },

    'skipLibCheck': {
      name: 'skipLibCheck',
      default: {
        value: false
      }
    },

    // Command Line sections
    // ???

    // Watch Options section
    'watch': {
      name: 'watch',
      default: {
        value: false
      }
    },

    'assumeChangesOnlyAffectDirectDependencies': {
      name: 'assumeChangesOnlyAffectDirectDependencies',
      default: {
        value: false
      }
    },

    'watchFile': {
      name: 'watchFile',
      default: {
        // allowed: fixedPollingInterval, priorityPollingInterval, dynamicPriorityPolling, useFsEvents, useFsEventsOnParentDirectory
        value: 'useFsEvents'
      },
      section: 'watchOptions'
    },

    'watchDirectory': {
      name: 'watchDirectory',
      default: {
        // allowed: fixedPollingInterval, dynamicPriorityPolling, useFsEvents
        value: 'useFsEvents'
      },
      section: 'watchOptions'
    },

    'fallbackPolling': {
      name: 'fallbackPolling',
      // allowed: fixedPollingInterval, priorityPollingInterval, dynamicPriorityPolling, synchronousWatchDirectory
      section: 'watchOptions'
    },

    'synchronousWatchDirectory': {
      name: 'synchronousWatchDirectory',
      default: {
        // todo check
        value: false
      },
      section: 'watchOptions'
    },

    'excludeDirectories': {
      name: 'excludeDirectories',
      // todo check default
      section: 'watchOptions'
    },

    'excludeFiles': {
      name: 'excludeFiles',
      section: 'watchOptions'
    },

    // Type Acquisition section
    // todo enable,include,exclude anddisableFilenameBasedTypeAcquisition
  }
}
