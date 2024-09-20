import { LogFileFolder, LogType } from '../types/base.type'
import { createDateFromString } from './date.helper'
import { getFullPath } from './file.helper'

const formatLogFiles = async ({
  logType,
  files,
}: {
  logType: LogType
  files: string[]
}): Promise<any[]> => {
  const filteredFiles = files.filter((file) => file.includes('log'))
  const logFiles = await Promise.all(
    filteredFiles.map(async (fileName) => {
      const fullPath = await getFullPath({
        filePath: `/logs/${logType === 'ACTIVITY' ? LogFileFolder.ACTIVITY : LogFileFolder.ERROR}/${fileName}`,
      })
      const date = createDateFromString(fileName.split('_')[0])
      return { fullPath, date, logType }
    }),
  )
  return logFiles
}

export default formatLogFiles
