export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
