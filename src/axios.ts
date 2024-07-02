import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export async function callApi<T>(
  url: string,
  method: AxiosRequestConfig['method'],
  data?: any
): Promise<AxiosResponse<T>> {
  try {
    const response = await axios({
      url,
      method,
      data,
      headers: { Accept: 'application/json' }
    })
    return response
  } catch (error) {
    throw error
  }
}

export default callApi