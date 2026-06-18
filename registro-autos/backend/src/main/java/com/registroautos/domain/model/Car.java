package com.registroautos.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Car {

    private Long id;
    private String brand;
    private String model;
    private Integer year;
    private String plateNumber;
    private String color;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}