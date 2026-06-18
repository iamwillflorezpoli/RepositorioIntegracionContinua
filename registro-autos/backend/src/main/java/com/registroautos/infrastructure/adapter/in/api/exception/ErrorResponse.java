package com.registroautos.infrastructure.adapter.in.api.exception;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ErrorResponse {

    private int status;
    private String message;
    private String path;
    private LocalDateTime timestamp;
    private List<String> errors;
}
