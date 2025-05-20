export type ErrorType = Error | null;

export type APIResponseError = {
  status: number;
  message: string;
  timestamp: string;
};
