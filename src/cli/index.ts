import {ConfigHelper} from './config-helper'
import {ConfigReader} from './config-reader'

const reader = new ConfigReader()
const helper = new ConfigHelper(reader.read(process.argv[2]))

console.log(helper.show())
