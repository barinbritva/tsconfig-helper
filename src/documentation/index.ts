import path from 'path'
import fs from 'fs'
import nunjucks from 'nunjucks'
import {getData} from '../shared/data'
import {Printer} from './printer'

nunjucks.configure(
  path.resolve(__dirname, '../../src/documentation/views'),
  {
    autoescape: false
  }
)

const printer = new Printer(getData())
const html = nunjucks.render('index.njk', {data: printer.options})
fs.writeFileSync(path.resolve(__dirname, '../../public/index.html'), html)
