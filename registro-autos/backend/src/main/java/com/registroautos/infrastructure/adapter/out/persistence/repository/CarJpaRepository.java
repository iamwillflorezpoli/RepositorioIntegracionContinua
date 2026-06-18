package com.registroautos.infrastructure.adapter.out.persistence.repository;

import com.registroautos.infrastructure.adapter.out.persistence.entity.CarEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarJpaRepository extends JpaRepository<CarEntity, Long> {

    List<CarEntity> findByUser_Id(Long userId);

    Optional<CarEntity> findByIdAndUser_Id(Long id, Long userId);

    boolean existsByPlateNumber(String plateNumber);

    boolean existsByPlateNumberAndIdNot(String plateNumber, Long id);
}