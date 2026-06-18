package com.registroautos.application.service;

import com.registroautos.application.dto.car.CarRequest;
import com.registroautos.application.dto.car.CarResponse;
import com.registroautos.application.exception.BusinessException;
import com.registroautos.application.exception.ConflictException;
import com.registroautos.application.exception.NotFoundException;
import com.registroautos.application.exception.UnauthorizedException;
import com.registroautos.domain.model.Car;
import com.registroautos.domain.model.User;
import com.registroautos.domain.port.in.CarUseCase;
import com.registroautos.domain.port.out.CarRepositoryPort;
import com.registroautos.domain.port.out.UserRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService implements CarUseCase {

    private static final int MIN_CAR_YEAR = 1900;

    private final CarRepositoryPort carRepositoryPort;
    private final UserRepositoryPort userRepositoryPort;

    @Override
    @Transactional(readOnly = true)
    public List<CarResponse> getMyCars() {
        User currentUser = getCurrentUser();

        return carRepositoryPort.findByUserId(currentUser.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CarResponse getMyCarById(Long id) {
        User currentUser = getCurrentUser();

        Car car = carRepositoryPort.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new NotFoundException("Auto no encontrado"));

        return toResponse(car);
    }

    @Override
    @Transactional
    public CarResponse createCar(CarRequest request) {
        User currentUser = getCurrentUser();

        validateYear(request.getYear());

        String plateNumber = normalizePlate(request.getPlateNumber());

        if (carRepositoryPort.existsByPlateNumber(plateNumber)) {
            throw new ConflictException("La placa ya se encuentra registrada");
        }

        Car car = Car.builder()
                .brand(request.getBrand().trim())
                .model(request.getModel().trim())
                .year(request.getYear())
                .plateNumber(plateNumber)
                .color(request.getColor().trim())
                .userId(currentUser.getId())
                .build();

        return toResponse(carRepositoryPort.save(car));
    }

    @Override
    @Transactional
    public CarResponse updateCar(Long id, CarRequest request) {
        User currentUser = getCurrentUser();
        validateYear(request.getYear());

        Car existingCar = carRepositoryPort.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new NotFoundException("Auto no encontrado"));

        String plateNumber = normalizePlate(request.getPlateNumber());

        if (carRepositoryPort.existsByPlateNumberAndIdNot(plateNumber, id)) {
            throw new ConflictException("La placa ya se encuentra registrada");
        }

        Car updatedCar = Car.builder()
                .id(existingCar.getId())
                .brand(request.getBrand().trim())
                .model(request.getModel().trim())
                .year(request.getYear())
                .plateNumber(plateNumber)
                .color(request.getColor().trim())
                .userId(currentUser.getId())
                .createdAt(existingCar.getCreatedAt())
                .build();

        return toResponse(carRepositoryPort.save(updatedCar));
    }

    @Override
    @Transactional
    public void deleteCar(Long id) {
        User currentUser = getCurrentUser();

        Car existingCar = carRepositoryPort.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new NotFoundException("Auto no encontrado"));

        carRepositoryPort.deleteById(existingCar.getId());
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepositoryPort.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Usuario autenticado no encontrado"));
    }

    private void validateYear(Integer year) {
        int currentYear = Year.now().getValue();

        if (year < MIN_CAR_YEAR || year > currentYear) {
            throw new BusinessException("El año del auto debe estar entre 1900 y " + currentYear);
        }
    }

    private String normalizePlate(String plateNumber) {
        return plateNumber.trim().toUpperCase();
    }

    private CarResponse toResponse(Car car) {
        return CarResponse.builder()
                .id(car.getId())
                .brand(car.getBrand())
                .model(car.getModel())
                .year(car.getYear())
                .plateNumber(car.getPlateNumber())
                .color(car.getColor())
                .build();
    }
}