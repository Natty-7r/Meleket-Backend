export type ExceptionResponse = {
  message: string
  property: string
}

export type BareApiResponse = {
  status: 'success' | 'fail'
  message: string
}

export type ApiResponse = BareApiResponse & {
  data: any
}
