export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiMessageResponse {
  success: boolean;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}