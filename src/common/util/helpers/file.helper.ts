import { BaseFilePathParams } from './../types/params.type'
import * as fs from 'fs'
import * as fsAsync from 'fs/promises'
import * as path from 'path'

// base fs functions

const getCwd = () => {
  return process.cwd()
}
const ensureFilePath = async ({ filePath }: BaseFilePathParams) => {
  try {
    await fsAsync.access(filePath)
    return filePath
  } catch (error) {
    const dir = path.dirname(filePath)
    await fsAsync.mkdir(dir, { recursive: true }) // Ensure the parent directory exists
    await fsAsync.writeFile(filePath, '')
    return filePath
  }
}
const getFullPath = async ({ filePath }: BaseFilePathParams) => {
  await ensureFilePath({ filePath })
  return path.join(getCwd(), filePath)
}

export const deleteFileAsync = async ({ filePath }: BaseFilePathParams) => {
  const fullPath = await getFullPath({ filePath })
  fsAsync.unlink(fullPath)
}
