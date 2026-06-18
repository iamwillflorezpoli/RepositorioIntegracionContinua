package com.registroautos.infrastructure.adapter.out.persistence;

import com.registroautos.domain.model.Car;
import com.registroautos.domain.port.out.CarRepositoryPort;
import com.registroautos.infrastructure.adapter.out.persistence.entity.CarEntity;
import com.registroautos.infrastructure.adapter.out.persistence.entity.UserEntity;
import com.registroautos.infrastructure.adapter.out.persistence.repository.CarJpaRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CarPersistenceAdapter implements CarRepositoryPort {

    private final CarJpaRepository carJpaRepository;
    private final EntityManager entityManager;

    @Override
    public List<Car> findByUserId(Long userId) {
        return carJpaRepository.findByUser_Id(userId)
                .stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<Car> findByIdAndUserId(Long id, Long userId) {
        return carJpaRepository.findByIdAndUser_Id(id, userId)
                .map(this::toDomain);
    }

    @Override
    public boolean existsByPlateNumber(String plateNumber) {
        return carJpaRepository.existsByPlateNumber(plateNumber);
    }

    @Override
    public boolean existsByPlateNumberAndIdNot(String plateNumber, Long id) {
        return carJpaRepository.existsByPlateNumberAndIdNot(plateNumber, id);
    }

    @Override
    public Car save(Car car) {
        CarEntity savedCar = carJpaRepository.save(toEntity(car));
        return toDomain(savedCar);
    }

    @Override
    public void deleteById(Long id) {
        carJpaRepository.deleteById(id);
    }

    private Car toDomain(CarEntity entity) {
        return Car.builder()
                .id(entity.getId())
                .brand(entity.getBrand())
                .model(entity.getModel())
                .year(entity.getYear())
                .plateNumber(entity.getPlateNumber())
                .color(entity.getColor())
                .userId(entity.getUser().getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private CarEntity toEntity(Car car) {
        UserEntity userReference = entityManager.getReference(UserEntity.class, car.getUserId());

        return CarEntity.builder()
                .id(car.getId())
                .brand(car.getBrand())
                .model(car.getModel())
                .year(car.getYear())
                .plateNumber(car.getPlateNumber())
                .color(car.getColor())
                .user(userReference)
                .createdAt(car.getCreatedAt())
                .updatedAt(car.getUpdatedAt())
                .build();
    }
}