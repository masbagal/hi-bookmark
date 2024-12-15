export type APIResponse<T> = {
  status: "SUCCESS" | "ERROR";
  data: T;
  message?: string;
};

export function successResponse<T>(returnedData: T): APIResponse<T> {
  return {
    status: "SUCCESS",
    data: returnedData,
  };
}

export function errorResponse<T>(
  returnedData: T,
  errorMessage: string
): APIResponse<T> {
  return {
    status: "ERROR",
    data: returnedData,
    message: errorMessage,
  };
}
