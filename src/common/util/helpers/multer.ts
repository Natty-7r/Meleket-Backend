import { BadRequestException } from '@nestjs/common'
import { Request } from 'express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { FileType, MulterFilterConfig, MulterStorageConfig } from '../types'
import { changeSpaceByHypen } from './string-util'

export const multerFilter = ({ fileType, maxSize = 5 }: MulterFilterConfig) => {
  const mimeTypes: { [key in FileType]: string[] } = {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    pdf: ['application/pdf'],
    txt: ['text/plain'],
    doc: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  }

  const allowedTypes = mimeTypes[fileType]

  return (req: Request, file: Express.Multer.File, callback: any) => {
    console.log(file, 'file in filter')
    // Ensure the file is an file format
    if (!file) {
      return callback(new BadRequestException('File cannot be empty!'), false)
    }

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new BadRequestException(`Only  ${fileType} files are allowed!`),
        false,
      )
    }
    // Ensure the file is not empty

    if (!file.size) {
      return callback(new BadRequestException('File cannot be empty!'), false)
    }

    if (file.size > maxSize * 1024 * 1024) {
      return callback(
        new BadRequestException(`File cannot be exceed ${maxSize} MB.`),
        false,
      )
    }
    callback(null, true)
  }
}

export const muluterStorage = (
  { folder, filePrefix }: MulterStorageConfig = { folder: '/', filePrefix: '' },
) => {
  const storage = diskStorage({
    destination: `./uploads/${folder}`,
    filename: (req, file, cb) => {
      const name = file.originalname.split('.')[0]
      const extension = extname(file.originalname)
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('')

      console.log(randomName, 'rrrr')
      cb(
        null,
        `${filePrefix}_${changeSpaceByHypen(name)}-${Date.now().toString()}${extension}`,
      )
    },
  })

  return storage
}

export default muluterStorage
