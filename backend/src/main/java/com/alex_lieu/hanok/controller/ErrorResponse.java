package com.alex_lieu.hanok.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
public class ErrorResponse {
    private int status;
    private String message;
    private Instant timestamp;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<Map<String, String>> details;

    public ErrorResponse(int status, String message, Instant timestamp) {
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
    }

    public ErrorResponse(int status, String message, Instant timestamp, List<Map<String, String>> details) {
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
        this.details = details;
    }
}
