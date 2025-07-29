package com.alex_lieu.hanok.controller;

import com.alex_lieu.hanok.exceptions.CustomerNotFoundException;
import com.alex_lieu.hanok.exceptions.order.OrderPlacementFailedException;
import com.alex_lieu.hanok.exceptions.order.PaymentFailedException;
import com.alex_lieu.hanok.exceptions.product.ProductNotFoundException;
import com.alex_lieu.hanok.exceptions.product.ProductVariantNotFoundException;
import com.alex_lieu.hanok.service.OrderExceptions;
import jakarta.persistence.PersistenceException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.hibernate.service.spi.ServiceException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(
            ConstraintViolationException ex
    ) {
        Map<String, String> errors = new HashMap<>();
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            errors.put(violation.getPropertyPath().toString(), violation.getMessage());
        }

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                errors.toString(),
                Instant.now()
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) {

        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());

        String errorMessage = String.join("; ", errors);

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                errorMessage,
                Instant.now()
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException ex
    ) {
        String errorMessage = "A conflict occurred with the current state of the resource";
        if (ex.getCause() instanceof ConstraintViolationException) {
            errorMessage = "A constraint was violated. Please check your input.";
        }
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                errorMessage + "|||" + ex.getMessage(),
                Instant.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(PersistenceException.class)
    public ResponseEntity<ErrorResponse> handlePersistenceException(
            PersistenceException ex
    ) {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getMessage(),
                Instant.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalStateException(
            IllegalStateException ex
    ) {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "The request cannot be processed due to the current state of the application" + "|||" + ex.getMessage(),
                Instant.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<ErrorResponse> handleServiceException(
            ServiceException ex
    ) {
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            Instant.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(OrderExceptions.InvalidOrderDataException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ErrorResponse> handleInvalidOrderDataException(OrderExceptions.InvalidOrderDataException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                Instant.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
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
//        logger.error("Payment failed: {}", ex.getMessage(), ex); // Log the exception with full stack trace
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
    public ResponseEntity<ErrorReply> handleOrderPlacementFailedException(OrderPlacementFailedException ex, WebRequest request) {
//        logger.error("Payment failed: {}", ex.getMessage(), ex); // Log the exception with full stack trace
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
    public ResponseEntity<ErrorReply>
    handleProductNotFoundException(ProductNotFoundException ex, WebRequest request) {
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
    public ResponseEntity<ErrorReply>
    handleProductVariantNotFoundException(ProductVariantNotFoundException ex, WebRequest request) {
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


    @ExceptionHandler(CustomerNotFoundException.class)
    public ResponseEntity<ErrorReply>
    handleCustomerNotFoundException(CustomerNotFoundException ex, WebRequest request) {
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
    public ResponseEntity<ErrorReply>
    handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
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
    public ResponseEntity<ErrorReply>
    handleUnsupportedOperationException(UnsupportedOperationException ex, WebRequest request) {
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
}
