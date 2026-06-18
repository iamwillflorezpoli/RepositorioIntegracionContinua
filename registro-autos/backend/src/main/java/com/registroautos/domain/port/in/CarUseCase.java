package com.registroautos.domain.port.in;

import com.registroautos.application.dto.car.CarRequest;
import com.registroautos.application.dto.car.CarResponse;

import java.util.List;

public interface CarUseCase {

    List<CarResponse> getMyCars();

    CarResponse getMyCarById(Long id);

    CarResponse createCar(CarRequest request);

    CarResponse updateCar(Long id, CarRequest request);

    void deleteCar(Long id);
}