package com.alex_lieu.hanok.controller;

import com.alex_lieu.hanok.dto.validation.ValidationError;
import com.alex_lieu.hanok.exceptions.CustomerNotFoundException;
import com.alex_lieu.hanok.exceptions.order.OrderPlacementFailedException;
import com.alex_lieu.hanok.exceptions.order.PaymentFailedException;
import com.alex_lieu.hanok.exceptions.product.ProductCreateFailedException;
import com.alex_lieu.hanok.exceptions.product.ProductNotFoundException;
import com.alex_lieu.hanok.exceptions.product.ProductUpdateFailedException;
import com.alex_lieu.hanok.exceptions.product.ProductVariantNotFoundException;
import jakarta.persistence.PersistenceException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.hibernate.service.spi.ServiceException;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.View;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

@ControllerAdvice
public class GlobalExceptionHandler {

    private final MessageSource messageSource;
    private final View error;

    public GlobalExceptionHandler(MessageSource messageSource, View error) {
        this.messageSource = messageSource;
        this.error = error;
    }

    // @ExceptionHandler(DataIntegrityViolationException.class)
    // public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
    // DataIntegrityViolationException ex
    // ) {
    // String errorMessage = "A conflict occurred with the current state of the
    // resource";
    // if (ex.getCause() instanceof ConstraintViolationException) {
    // errorMessage = "A constraint was violated. Please check your input.";
    // }
    // ErrorResponse errorResponse = new ErrorResponse(
    // HttpStatus.CONFLICT.value(),
    // errorMessage + "|||" + ex.getMessage(),
    // Instant.now()
    // );
    // return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    // }

    // @ExceptionHandler(PersistenceException.class)
    // public ResponseEntity<ErrorResponse> handlePersistenceException(
    // PersistenceException ex
    // ) {
    // ErrorResponse errorResponse = new ErrorResponse(
    // HttpStatus.INTERNAL_SERVER_ERROR.value(),
    // ex.getMessage(),
    // Instant.now()
    // );
    // return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    // }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalStateException(
            IllegalStateException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "The request cannot be processed due to the current state of the application" + "|||" + ex.getMessage(),
                Instant.now());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<ErrorReply> handleServiceException(
            ServiceException ex, WebRequest request) {
        String errorMessage;
        String errorCode;
        HttpStatus status = HttpStatus.BAD_REQUEST;
        if (ex.getCause() instanceof DataAccessException) {
            errorMessage = "A database error occurred while processing the request";
            errorCode = "DATABASE_ERROR";
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        } else {
            errorMessage = ex.getMessage();
            errorCode = "SERVICE_ERROR";
        }
        ErrorReply errorResponse = ErrorReply.builder()
                .timestamp(LocalDateTime.now())
                .status(status)
                .statusCode(status.value())
                .error(status.getReasonPhrase())
                .message(errorMessage)
                .path(request.getDescription(false).replace("uri=", ""))
                .code(errorCode)
                .build();
        return new ResponseEntity<>(errorResponse, status);
    }

    //
    // BELOW IS THE UPDATED EXCEPTION HANDLERS USING ERROR_REPLY
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    @ExceptionHandler(PaymentFailedException.class)
    public ResponseEntity<ErrorReply> handlePaymentFailedException(PaymentFailedException ex, WebRequest request) {
        // logger.error("Payment failed: {}", ex.getMessage(), ex); // Log the exception
        // with full stack trace
        ErrorReply errorReply = ErrorReply.builder()
                .timestamp(ex.getTimestamp() != null ? ex.getTimestamp() : LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST)
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .error("Payment failed")
                .message(ex.getGatewayMessage())
                .path(request.getDescription(false).replace("uri=", ""))
                .code(ex.getGatewayErrorCode())
                .build();
        return new ResponseEntity<>(errorReply, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(OrderPlacementFailedException.class)
    public ResponseEntity<ErrorReply> handleOrderPlacementFailedException(OrderPlacementFailedException ex,
            WebRequest request) {
        // logger.error("Payment failed: {}", ex.getMessage(), ex); // Log the exception
        // with full stack trace
        ErrorReply errorReply = ErrorReply.builder()
                .timestamp(ex.getTimestamp() != null ? ex.getTimestamp() : LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST)
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .error("Order placement failed")
                .message(ex.getError())
                .path(request.getDescription(false).replace("uri=", ""))
                .code(ex.getReasonCode())
                .build();
        return new ResponseEntity<>(errorReply, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorReply> handleRuntimeException(RuntimeException ex, WebRequest request) {
        ErrorReply errorReply = ErrorReply.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Internal server error")
                .message("An unexpected error occurred. Please try again later.")
                .path(request.getDescription(false).replace("uri=", ""))
                .code("UNEXPECTED_ERROR")
                .build();
        return new ResponseEntity<>(errorReply, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorReply> handleAllExceptions(Exception ex, WebRequest request) {

        ErrorReply errorResponse = ErrorReply.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Internal Server Error")
                .message("An unexpected error occurred. Please contact support if the problem persists.")
                .path(request.getDescription(false).replace("uri=", ""))
                .code("UNKNOWN_ERROR")
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ErrorReply> handleProductNotFoundException(ProductNotFoundException ex, WebRequest request) {
        ErrorReply errorResponse = ErrorReply.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND)
                .statusCode(HttpStatus.NOT_FOUND.value())
                .error("Not found")
                .message(ex.getMessage())
                .path(request.getDescription(false).replace("uri=", ""))
                .code("PRODUCT_NOT_FOUND")
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ProductVariantNotFoundException.class)
    public ResponseEntity<ErrorReply> handleProductVariantNotFoundException(ProductVariantNotFoundException ex,
            WebRequest request) {
        ErrorReply errorResponse = ErrorReply.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND)
                .statusCode(HttpStatus.NOT_FOUND.value())
                .error("Not found")
                .message(ex.getMessage())
                .path(request.getDescription(false).replace("uri=", ""))
                .code("PRODUCT_VARIANT_NOT_FOUND")
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ProductCreateFailedException.class)
    public ResponseEntity<ErrorReply> handleProductCreateFailedException(ProductCreateFailedException ex,
            WebRequest request) {
        String errorMessage;
        String errorCode;
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        Throwable rootCause = ex.getCause() != null ? ex.getCause().getCause() : null;
        if (rootCause instanceof org.hibernate.exception.ConstraintViolationException cve) {
            if (cve.getConstraintName() != null && cve.getConstraintName().toLowerCase().contains("unique")) {
                errorMessage = "Failed to create product. A product with the same unique identifier already exists.";
                errorCode = "UNIQUE_CONSTRAINT_VIOLATION";
                status = HttpStatus.CONFLICT;
            } else {
                errorMessage = "A database constraint violation occurred.";
                errorCode = "DATABASE_CONSTRAINT_VIOLATION";
                status = HttpStatus.BAD_REQUEST;
            }
        } else {
            errorMessage = ex.getMessage();
            errorCode = "PRODUCT_CREATE_FAILURE";
        }
        ErrorReply errorResponse = ErrorReply.builder()
                .timestamp(LocalDateTime.now())
                .status(status)
                .statusCode(status.value())
                .error(status.getReasonPhrase())
                .message(errorMessage)
                .path(request.getDescription(false).replace("uri=", ""))
                .code(errorCode)
                .build();
        return new ResponseEntity<>(errorResponse, status);
    }

    @ExceptionHandler(ProductUpdateFailedException.class)
    public ResponseEntity<ErrorReply> handleProductUpdateFailedException(ProductUpdateFailedException ex,
            WebRequest request) {
        String errorMessage;
        String errorCode;
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        Throwable rootCause = ex.getCause() != null ? ex.getCause().getCause() : null;
        if (rootCause instanceof DataIntegrityViolationException) {
            errorMessage = "The product could not be updated due to a data integrity violations.";
            errorCode = "DATA_INTEGRITY_VIOLATION";
            status = HttpStatus.CONFLICT;
        } else if (rootCause instanceof ConstraintViolationException) {
            errorMessage = "A database constraint was violated while updating the product.";
            errorCode = "DATABASE_CONSTRAINT_VIOLATION";
            status = HttpStatus.CONFLICT;
        } else {
            errorMessage = ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred.";
            errorCode = "INTERNAL_SERVER_ERROR";
        }
        ErrorReply errorResponse = ErrorReply.builder()
                .timestamp(LocalDateTime.now())
                .status(status)
                .statusCode(status.value())
                .error(status.getReasonPhrase())
                .message(errorMessage)
                .path(request.getDescription(false).replace("uri=", ""))
                .code(errorCode)
                .build();
        return new ResponseEntity<>(errorResponse, status);
    }

    @ExceptionHandler(CustomerNotFoundException.class)
    public ResponseEntity<ErrorReply> handleCustomerNotFoundException(CustomerNotFoundException ex,
            WebRequest request) {
        ErrorReply errorResponse = ErrorReply.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND)
                .statusCode(HttpStatus.NOT_FOUND.value())
                .error("Not found")
                .message(ex.getMessage())
                .path(request.getDescription(false).replace("uri=", ""))
                .code("CUSTOMER_NOT_FOUND")
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorReply> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        ErrorReply errorResponse = ErrorReply.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST)
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .error("Bad request")
                .message(ex.getMessage())
                .path(request.getDescription(false).replace("uri=", ""))
                .code("INVALID_INPUT")
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnsupportedOperationException.class)
    public ResponseEntity<ErrorReply> handleUnsupportedOperationException(UnsupportedOperationException ex,
            WebRequest request) {
        ErrorReply errorResponse = ErrorReply.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST)
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .error("Unsupported operation")
                .message(ex.getMessage())
                .path(request.getDescription(false).replace("uri=", ""))
                .code("UNSUPPORTED_OPERATION")
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorReply> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex,
            WebRequest request) {
        Map<String, List<ValidationError>> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            if (error instanceof FieldError fieldError) {
                String fieldName = fieldError.getField();
                ValidationError validationError = ValidationError.builder()
                        .code(fieldError.getCode())
                        .message(fieldError.getDefaultMessage())
                        .parameters(extractParameters(fieldError))
                        .build();
                errors.computeIfAbsent(fieldName, key -> new ArrayList<>()).add(validationError);
            }
        });
        ErrorReply errorResponse = ErrorReply.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST)
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .error("Validation error")
                .validationErrors(errors)
                .path(request.getDescription(false).replace("uri=", ""))
                .code("INVALID_INPUT_DATA")
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    private Map<String, Object> extractParameters(FieldError fieldError) {
        Map<String, Object> params = new HashMap<>();

        Object rejectedValue = fieldError.getRejectedValue();
        if (rejectedValue != null) {
            params.put("actual", rejectedValue.toString());
        }

        if (Objects.requireNonNull(fieldError.getCode()).contains("Size")) {
            Object[] args = fieldError.getArguments();
            if (args != null && args.length >= 3) {
                params.put("min", args[2]);
                params.put("max", args[1]);
            }
        }

        return params;
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorReply> handleConstraintViolation(
            ConstraintViolationException ex, WebRequest request) {
        Map<String, List<ValidationError>> errors = new HashMap<>();
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            String fieldName = violation.getPropertyPath().toString();

            ValidationError validationError = ValidationError.builder()
                    .code(violation.getConstraintDescriptor().getAnnotation().annotationType().getSimpleName())
                    .message(violation.getMessage())
                    .parameters(extractConstraintViolationParameters(violation))
                    .build();

            errors.computeIfAbsent(fieldName, key -> new ArrayList<>()).add(validationError);
        }
        ErrorReply errorResponse = ErrorReply.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST)
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .error("Validation error")
                .message("Constraint violations found")
                .validationErrors(errors)
                .path(request.getDescription(false).replace("uri=", ""))
                .code("CONSTRAINT_VIOLATION")
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    private Map<String, Object> extractConstraintViolationParameters(ConstraintViolation<?> violation) {
        Map<String, Object> params = new HashMap<>();

        violation.getConstraintDescriptor().getAttributes().forEach((key, value) -> {
            if (value != null) {
                params.put(key, value);
            }
        });

        params.put("actual", violation.getInvalidValue());

        return params;
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorReply> handleDataIntegrityViolation(
            DataIntegrityViolationException ex, WebRequest request) {
        String errorMessage;
        String errorCode;
        Throwable rootCause = ex.getRootCause();
        if (rootCause instanceof org.hibernate.exception.ConstraintViolationException hibernateException) {
            String constrainName = hibernateException.getConstraintName();
            if (constrainName != null && constrainName.toLowerCase().contains("unique")) {
                errorMessage = "The provided data is a duplicate and must be unique";
                errorCode = "UNIQUE_CONSTRAINT_VIOLATION";
            } else {
                errorMessage = "A database constraint was violated. Please check your input.";
                errorCode = "DATA_INTEGRITY_VIOLATION";
            }
        } else if (rootCause instanceof ConstraintViolationException) {
            errorMessage = "One or more constraint violations were violated. Please check your input.";
            errorCode = "VALIDATION_CONSTRAINT_VIOLATION";
        } else {
            errorMessage = "A conflict occurred with the current state of the resource.";
            errorCode = "DATA_INTEGRITY_VIOLATION";
        }
        ErrorReply errorResponse = ErrorReply.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.CONFLICT)
                .statusCode(HttpStatus.CONFLICT.value())
                .error("Conflict")
                .message(errorMessage)
                .path(request.getDescription(false).replace("uri=", ""))
                .code(errorCode)
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(PersistenceException.class)
    public ResponseEntity<ErrorReply> handlePersistenceException(
            PersistenceException ex, WebRequest request) {
        String errorMessage;
        String errorCode;
        HttpStatus httpStatus;
        Throwable rootCause = ex.getCause();
        if (rootCause instanceof ConstraintViolationException) {
            errorMessage = "The provided data is a duplicate and must be unique.";
            errorCode = "DATA_INTEGRITY_VIOLATION";
            httpStatus = HttpStatus.CONFLICT;
        } else if (rootCause instanceof DataIntegrityViolationException) {
            errorMessage = "The provided data violates a database constraint.";
            errorCode = "DATA_INTEGRITY_VIOLATION";
            httpStatus = HttpStatus.CONFLICT;
        } else {
            errorMessage = "An unexpected database error occurred.";
            errorCode = "DATA_INTEGRITY_VIOLATION";
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        ErrorReply errorResponse = ErrorReply.builder()
                .timestamp(LocalDateTime.now())
                .status(httpStatus)
                .statusCode(httpStatus.value())
                .error(httpStatus.getReasonPhrase())
                .message(errorMessage)
                .path(request.getDescription(false).replace("uri=", ""))
                .code(errorCode)
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // This is thrown when Spring's HttpMessageConverter cannot deserialize the JSON text due to it including invalid/unparseable data.
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorReply> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex, WebRequest request) {
        ErrorReply errorResponse = ErrorReply.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST)
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .error("Malformed request")
                .message("The request body is unparseable or contains invalid characters.")
                .path(request.getDescription(false).replace("uri=", ""))
                .code("MALFORMED_JSON")
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

}
