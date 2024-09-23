export type TApiSuccess<T> = {
  status: "success";
  message: string;
  data?: T;
};

export interface TApiError {
  status: "error";
  message: string;
  code?: number;
}

export function CreateSuccessResponseApi<T>(
  message: string,
  data?: T,
): TApiSuccess<T> {
  return {
    status: "success",
    message,
    data,
  };
}

export function CreateErrorResponseApi(message: string): TApiError {
  return {
    status: "error",
    message,
  };
}
