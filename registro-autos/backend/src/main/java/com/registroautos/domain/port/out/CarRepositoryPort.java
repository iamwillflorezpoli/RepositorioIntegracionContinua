package com.registroautos.domain.port.out;

import com.registroautos.domain.model.Car;

import java.util.List;
import java.util.Optional;

public interface CarRepositoryPort {

    List<Car> findByUserId(Long userId);

    Optional<Car> findByIdAndUserId(Long id, Long userId);

    boolean existsByPlateNumber(String plateNumber);

    boolean existsByPlateNumberAndIdNot(String plateNumber, Long id);

    Car save(Car car);

    void deleteById(Long id);
}