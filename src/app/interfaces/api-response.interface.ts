export interface ApiResponse<T> {
    message: string;
    status: boolean;
    data: T;
}

export interface ApiErrorResponse {
    message: string;
    status: boolean;
    error?: {
        errorMessage: string;
        errorCode?: number;
        errorType?: string;
    };
}

export type ApiResponseOrError<T> = ApiResponse<T> | ApiErrorResponse;

export function isApiResponse<T>(response: ApiResponseOrError<T>): response is ApiResponse<T> {
    return 'data' in response;
}

export function isApiErrorResponse<T>(response: ApiResponseOrError<T>): response is ApiErrorResponse {
    return 'error' in response;
}

export function getResponseData<T>(response: ApiResponseOrError<T>): T {
    if (isApiResponse(response)) {
        return response.data;
    }
    throw new Error('Invalid response format');
}
