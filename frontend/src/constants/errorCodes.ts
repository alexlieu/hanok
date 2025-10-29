/**
 * Backend error codes that can be received from the API.
 * These correspond to the error codes defined in GlobalExceptionHandler.java
 */
export const BACKEND_ERROR_CODES = {
  // Payment-related errors
  INSUFFICIENT_FUNDS: "INSUFFICIENT_FUNDS",
  TOKEN_PROCESSING_FAILED: "TOKEN_PROCESSING_FAILED",
  PAYMENT_METHOD_NOT_SUPPORTED: "PAYMENT_METHOD_NOT_SUPPORTED",

  // Database and data integrity errors
  DATABASE_ERROR: "DATABASE_ERROR",
  DATA_INTEGRITY_VIOLATION: "DATA_INTEGRITY_VIOLATION",
  DATABASE_CONSTRAINT_VIOLATION: "DATABASE_CONSTRAINT_VIOLATION",
  UNIQUE_CONSTRAINT_VIOLATION: "UNIQUE_CONSTRAINT_VIOLATION",
  VALIDATION_CONSTRAINT_VIOLATION: "VALIDATION_CONSTRAINT_VIOLATION",
  CONSTRAINT_VIOLATION: "CONSTRAINT_VIOLATION",

  // Service and general errors
  SERVICE_ERROR: "SERVICE_ERROR",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",

  // Not found errors
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  PRODUCT_VARIANT_NOT_FOUND: "PRODUCT_VARIANT_NOT_FOUND",
  CUSTOMER_NOT_FOUND: "CUSTOMER_NOT_FOUND",

  // Input validation errors
  INVALID_INPUT: "INVALID_INPUT",
  INVALID_INPUT_DATA: "INVALID_INPUT_DATA",
  MALFORMED_JSON: "MALFORMED_JSON",

  // Operation errors
  UNSUPPORTED_OPERATION: "UNSUPPORTED_OPERATION",
  PRODUCT_CREATE_FAILURE: "PRODUCT_CREATE_FAILURE",
} as const;

export type BackendErrorCode =
  (typeof BACKEND_ERROR_CODES)[keyof typeof BACKEND_ERROR_CODES];

/**
 * Note: Payment gateway error codes (from PaymentFailedException.gatewayErrorCode)
 * and order placement reason codes (from OrderPlacementFailedException.reasonCode)
 * are dynamic and come from external services. They are not included in this
 * constant object but may be checked dynamically in error handling code.
 */
