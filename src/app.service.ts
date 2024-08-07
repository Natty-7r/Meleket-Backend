import { Injectable, InternalServerErrorException } from '@nestjs/common'
import * as path from 'path'
import * as fs from 'fs'

@Injectable()
export default class AppService {
  constructor() {}

  async agetReadme() {
    try {
      console.log(__dirname)
      const readmePath = path.join(__dirname, '../', 'README.md')
      console.log(readmePath)
      return fs.readFileSync(readmePath, 'utf8')
    } catch (err) {
      console.log('\n\n\n')
      console.log(err)
      throw new InternalServerErrorException('Unable to read readme file')
    }
  }
}
