import {TsConfig} from '../src/cli/interfaces'
import {Completor} from '../src/cli/completor'
import {Annotator} from '../src/cli/annotator'

interface ComposedConfig {
    result: TsConfig
    annotator: Annotator
}

function composeConfig(config: TsConfig): ComposedConfig {
    const completor = new Completor(config, true)
    const annotator = new Annotator(
        completor.getOriginalConfig(),
        completor.getResultConfig()
    )

    return {
        result: completor.getResultConfig(),
        annotator: annotator
    }
}

test('exclude has specified value', () => {
    const composedConfig = composeConfig({
        compilerOptions: {},
        exclude: ['some-folder', 'some-other-folder']
    })

    const annotation = composedConfig.annotator.getAnnotationFor('exclude');
    expect(composedConfig.result.exclude).toEqual(['some-folder', 'some-other-folder'])
    expect(annotation.default).toEqual(undefined)
    expect(annotation.deprecation).toEqual(undefined)
})

test('exclude contains package managers folders', () => {
    const composedConfig = composeConfig({
        compilerOptions: {},
    })

    const annotation = composedConfig.annotator.getAnnotationFor('exclude')
    expect(composedConfig.result.exclude).toEqual([
        'node_modules',
        'bower_components',
        'jspm_packages'
    ])
    expect(annotation.default).toEqual(
        'By default ["node_modules", "bower_components", "jspm_packages"], ' +
        'if `outDir` is defined then ["%outDir%"], ' +
        'if `declarationDir` is defined then ["%declarationDir%"]'
    )
    expect(annotation.deprecation).toEqual(undefined)
})

test('exclude contains package managers folders and outDir', () => {
    const composedConfig = composeConfig({
        compilerOptions: {
            outDir: './build'
        }
    })

    const annotation = composedConfig.annotator.getAnnotationFor('exclude')
    expect(composedConfig.result.exclude).toEqual([
        'node_modules',
        'bower_components',
        'jspm_packages',
        './build'
    ])
    expect(annotation.default).toEqual(
        'By default ["node_modules", "bower_components", "jspm_packages"], ' +
        'if `outDir` is defined then ["%outDir%"], ' +
        'if `declarationDir` is defined then ["%declarationDir%"]'
    )
    expect(annotation.deprecation).toEqual(undefined)
})

test('exclude contains package managers folders and declarationDir', () => {
    const composedConfig = composeConfig({
        compilerOptions: {
            declarationDir: './types'
        }
    })

    const annotation = composedConfig.annotator.getAnnotationFor('exclude')
    expect(composedConfig.result.exclude).toEqual([
        'node_modules',
        'bower_components',
        'jspm_packages',
        './types'
    ])
    expect(annotation.default).toEqual(
        'By default ["node_modules", "bower_components", "jspm_packages"], ' +
        'if `outDir` is defined then ["%outDir%"], ' +
        'if `declarationDir` is defined then ["%declarationDir%"]'
    )
    expect(annotation.deprecation).toEqual(undefined)
})

test('exclude contains package managers folders, outDir and declarationDir', () => {
    const composedConfig = composeConfig({
        compilerOptions: {
            outDir: './build',
            declarationDir: './types'
        }
    })

    const annotation = composedConfig.annotator.getAnnotationFor('exclude')
    expect(composedConfig.result.exclude).toEqual([
        'node_modules',
        'bower_components',
        'jspm_packages',
        './build',
        './types'
    ])
    expect(annotation.default).toEqual(
        'By default ["node_modules", "bower_components", "jspm_packages"], ' +
        'if `outDir` is defined then ["%outDir%"], ' +
        'if `declarationDir` is defined then ["%declarationDir%"]'
    )
    expect(annotation.deprecation).toEqual(undefined)
})
