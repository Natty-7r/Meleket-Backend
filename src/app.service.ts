import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { marked } from 'marked'
import * as path from 'path'
import * as fs from 'fs'

@Injectable()
export default class AppService {
  async agetReadme() {
    try {
      const readmePath = path.join(__dirname, '../', 'README.md')
      const fileContent = fs.readFileSync(readmePath, 'utf8')
      return await marked.parse(fileContent)
    } catch (err) {
      throw new InternalServerErrorException('Unable to read readme file')
      return null
    }
  }
}
