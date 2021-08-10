import {ConfigAnnotator} from './config-annotator'
import {ConfigHelper} from './config-helper'
import {ConfigReader} from './config-reader'

const reader = new ConfigReader()
const helper = new ConfigHelper(new ConfigAnnotator(), reader.read(process.argv[2]))

// console.log(helper.getAsObject())
console.log(helper.getAsString(true))
