import axios from 'axios'
import { useCallback } from 'react'

import { UG_URL } from '../Constants'

const sendRemoteLog = async (level, message, data) => {
  axios
    .post(`${UG_URL}/log`, {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    })
    .then(() => {
      console.log('sent remote log', message)
    })
    .catch(error => {
      console.error('Failed to send remote log:', error)
    })
}

sendRemoteLog('INFO', 'current ENV:', process.env.NODE_ENV)
export const useLogger = () => {
  const logInfo = useCallback((message, data) => {
    console.log(message, data)
    if (process.env.NODE_ENV === 'development') {
      sendRemoteLog('INFO', message, data)
    }
  }, [])

  const logError = useCallback((message, error) => {
    console.error(message, error)
    if (process.env.NODE_ENV === 'production') {
      sendRemoteLog('error', message, { error: error?.toString() })
    }
  }, [])

  const logWarn = useCallback((message, data) => {
    console.warn(message, data)
    if (process.env.NODE_ENV === 'production') {
      sendRemoteLog('warn', message, data)
    }
  }, [])

  return { logInfo, logError, logWarn }
}
