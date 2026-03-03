export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error
  }
  
  if (error instanceof Error) {
    return new ApiError(error.message)
  }
  
  return new ApiError('An unexpected error occurred')
}

export const getErrorMessage = (error: ApiError): string => {
  switch (error.status) {
    case 400:
      return 'Invalid request. Please check your input.'
    case 401:
      return 'Authentication required. Please log in again.'
    case 403:
      return 'Access denied. You do not have permission to perform this action.'
    case 404:
      return 'The requested resource was not found.'
    case 500:
      return 'Server error. Please try again later.'
    default:
      return error.message || 'An error occurred. Please try again.'
  }
}
