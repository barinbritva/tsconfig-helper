import {Annotator} from './annotator'
import {Completor} from './completor'
import {InputOutput} from './input-output'

const configPath = process.argv[2]
const needToExplain = process.argv[3]

const helper = new Completor(InputOutput.read(configPath))

if (needToExplain === 'e') {
  const annotator = new Annotator(helper.getOriginalConfig(), helper.getResultConfig())
  console.log(annotator.generateAnnotatedConfig())
} else {
  console.log(InputOutput.toString(helper.getResultConfig()))
}
