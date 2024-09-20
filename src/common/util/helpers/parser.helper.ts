import { LogType } from '../types/base.type'

export const parseActivityLogs = (rawLogs: string) => {
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
      data: parsedLog?.res,
    }
  })
}
export const parseErrorLogs = (rawLogs: string) => {
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
      errorType: parsedLog?.errorType,
      fileName: parsedLog?.fileName,
      row: parsedLog?.row,
      col: parsedLog?.col,
      stack: parsedLog?.stack,
      ip: parsedLog?.ip,
    }
  })
}

export const parseLogs = (rawLogs: string, logType: LogType) => {
  if (logType === LogType.ACTIVITY) return parseActivityLogs(rawLogs)
  return parseErrorLogs(rawLogs)
}
