import axios, { AxiosResponse } from 'axios'
import { APICallParams } from '../types/params.type'
import { ApiResponse } from '../types/responses.type'

export const api = async ({
  url,
  method,
  authToken,
  body,
}: APICallParams): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios({
      url,
      method,
      headers: {
        /* eslint-disable */
        'Content-Type': 'application/json',
        /* eslint-disable */
        Authorization: `Bearer ${authToken}`,
      },
      data: body,
    })

    if (response.status !== 200) {
      throw new Error(JSON.stringify({ ...response.data }))
    }

    return { ...response.data }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle axios error with response
      throw new Error(JSON.stringify({ ...error.response.data }))
    } else {
      // Handle other types of errors
      throw error
    }
  }
}

export default api
