import {ConfigAnnotator} from './config-annotator'
import {ConfigCompletor} from './config-completor'
import {ConfigReader} from './config-reader'

const reader = new ConfigReader()
const helper = new ConfigCompletor(reader.read(process.argv[2]))
const annotator = new ConfigAnnotator(helper.getOriginalConfig(), helper.getResultConfig())

// console.log(helper.getOriginalConfig(), helper.getResultConfig())
console.log(annotator.generateAnnotatedConfig())
reader.write(helper.getResultConfig(), 'test.json')
