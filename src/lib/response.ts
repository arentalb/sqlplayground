interface SuccessResponse<T = undefined> {
  success: true;
  data?: T;
}

interface ErrorResponse {
  statusCode: number;
  error: true;
  message: string;
}

interface HandleResponseOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (message: string) => void;
}

/**
 * Handles a response based on its type (success or error) and executes appropriate callbacks.
 *
 * @param response - The response object, which can be either a SuccessResponse or ErrorResponse
 * @param options - An object containing optional callback functions for handling success and error
 */
export function handleResponse<T>(
  response: SuccessResponse<T> | ErrorResponse,
  options: HandleResponseOptions<T> = {},
) {
  if (!response) {
    if (options.onSuccess) {
      options.onSuccess(response as T);
    }
    return;
  }

  if ("success" in response && response.success) {
    if (options.onSuccess) {
      options.onSuccess(response.data as T);
    }
  } else {
    const { message } = response as ErrorResponse; // Extract the error message

    if (options.onError) {
      options.onError(message);
    }
  }
}

/**
 * Creates a successful response object.
 *
 * @param data - Optional data to include in the response
 * @returns An object representing a successful response
 */
export function createSuccessResponse<T>(data?: T): SuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Creates an error response object.
 *
 * @param errorMessage - The error message to include in the response
 * @param statusCode - Optional HTTP status code (default is 400)
 * @returns An object representing an error response
 */
export function createErrorResponse(
  errorMessage: string,
  statusCode: number = 400,
): ErrorResponse {
  return {
    statusCode,
    error: true,
    message: errorMessage,
  };
}
