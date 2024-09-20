import { LogFileFolder, LogType } from '../types/base.type'
import { createDateFromString } from './date.helper'
import { getFullPath } from './file.helper'

export const formatLogFiles = async ({
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
        filePath: `/logs/${logType == 'ACTIVITY' ? LogFileFolder.ACTIVITY : LogFileFolder.ERROR}/${fileName}`,
      })
      const date = createDateFromString(fileName.split('_')[0])
      return { fullPath, date, logType }
    }),
  )
  return logFiles
}

export const formatActivityLogs = (rawLogs: string) => {
  const logEntries = rawLogs.split('\n').filter(Boolean)

  return logEntries.map((logEntry) => {
    const parsedLog = JSON.parse(logEntry)

    return {
      id: parsedLog?.id,
      level: parsedLog?.level,
      message: parsedLog?.message || 'No message',
      method: parsedLog?.method,
      status: parsedLog?.status,
      url: parsedLog?.url,
      timestamp: new Date(parsedLog?.timestamp)?.toLocaleString(), // Convert to local date string
      accessToken: parsedLog?.res?.access_token,
      userMessage: parsedLog?.res?.message,
      userStatus: parsedLog?.res.status,
    }
  })
}
