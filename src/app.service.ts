import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { marked } from 'marked'
import { getFileContent } from './common/util/helpers/file.helper'

@Injectable()
export default class AppService {
  async agetReadme() {
    try {
      return await marked.parse(await getFileContent({ filePath: 'README.md' }))
    } catch (err) {
      throw new InternalServerErrorException('Unable to read readme file')
    }
  }
}
