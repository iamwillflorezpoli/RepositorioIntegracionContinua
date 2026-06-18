package com.registroautos.application.dto.car;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CarRequest {

    @NotBlank(message = "La marca es obligatoria")
    private String brand;

    @NotBlank(message = "El modelo es obligatorio")
    private String model;

    @NotNull(message = "El año es obligatorio")
    private Integer year;

    @NotBlank(message = "La placa es obligatoria")
    private String plateNumber;

    @NotBlank(message = "El color es obligatorio")
    private String color;
}