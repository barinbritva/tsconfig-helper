import yargs from 'yargs'
import {Annotator} from './annotator'
import {Completor} from './completor'
import {InputOutput} from './input-output'
import {CoverageStats} from './coverage-stats'

const argv = yargs(process.argv.slice(2))
  .option('coverage', {
    describe: 'Show flags coverage status',
    boolean: true 
  })
  .option('out', {
    alias: 'o',
    describe: 'File path to write the result',
    string: true
  })
  .option('explain', {
    alias: 'e',
    describe: 'Add explanations to output',
    boolean: true 
  })
  // todo implement
  .option('short', {
    alias: 's',
    describe: 'Short explanations instead of verbose',
    boolean: true 
  })
  // todo implement
  .option('ignore', {
    alias: 'i',
    describe: 'Do not include empty default values such as falsy and empty arrays to result config',
    boolean: true 
  })
  .argv

const showCoverage = argv['c'] == null ? false : Boolean(argv['c'])

if (showCoverage) {
  console.log(CoverageStats.show())
} else {
  const configPath = argv._[0] == null ? 'tsconfig.json' : String(argv._[0])
  const needToExplain = argv['e']
  const outputFilePath = argv['o'] == null ? undefined : String(argv['o'])

  const completor = new Completor(InputOutput.read(configPath))
  let result = ''

  if (needToExplain === true) {
    const annotator = new Annotator(completor.getOriginalConfig(), completor.getResultConfig())
    result = annotator.generateAnnotatedConfig()
  } else {
    result = InputOutput.toString(completor.getResultConfig())
  }

  if (outputFilePath != null) {
    InputOutput.write(result, outputFilePath)
  } else {
    console.log(result)
  }
}

process.exit(0)
