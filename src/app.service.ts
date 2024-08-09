import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { marked } from 'marked'
import * as path from 'path'
import * as fs from 'fs'
@Injectable()
export default class AppService {
  constructor() {}

  async agetReadme() {
    try {
      const readmePath = path.join(__dirname, '../', 'README.md')
      const fileContent = fs.readFileSync(readmePath, 'utf8')
      return marked.parse(fileContent)
    } catch (err) {
      console.log(err)
      throw new InternalServerErrorException('Unable to read readme file')
    }
  }
}
