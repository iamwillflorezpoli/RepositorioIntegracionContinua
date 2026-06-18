package com.registroautos.infrastructure.adapter.in.api;

import com.registroautos.application.dto.car.CarRequest;
import com.registroautos.application.dto.car.CarResponse;
import com.registroautos.domain.port.in.CarUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarUseCase carUseCase;

    @GetMapping
    public List<CarResponse> getMyCars() {
        return carUseCase.getMyCars();
    }

    @GetMapping("/{id}")
    public CarResponse getMyCarById(@PathVariable Long id) {
        return carUseCase.getMyCarById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CarResponse createCar(@Valid @RequestBody CarRequest request) {
        return carUseCase.createCar(request);
    }

    @PutMapping("/{id}")
    public CarResponse updateCar(
            @PathVariable Long id,
            @Valid @RequestBody CarRequest request
    ) {
        return carUseCase.updateCar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCar(@PathVariable Long id) {
        carUseCase.deleteCar(id);
    }
}