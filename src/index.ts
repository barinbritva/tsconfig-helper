import path from 'path'
import fs from 'fs'
import nunjucks from 'nunjucks'
import {getNormalizedData, prepareToPrint} from './data'

nunjucks.configure(
  path.resolve(__dirname, '../src/templating/views'),
  {
    autoescape: false
  }
)

const data = prepareToPrint(getNormalizedData())
const html = nunjucks.render('index.njk', {data: data})
fs.writeFileSync(path.resolve(__dirname, '../public/index.html'), html)
