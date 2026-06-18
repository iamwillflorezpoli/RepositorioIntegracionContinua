package com.registroautos.application.dto.car;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CarResponse {

    private Long id;
    private String brand;
    private String model;
    private Integer year;
    private String plateNumber;
    private String color;
}