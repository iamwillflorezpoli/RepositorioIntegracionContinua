package com.registroautos.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "cars",
        schema = "dbo",
        uniqueConstraints = {
                @UniqueConstraint(name = "UK_cars_plate_number", columnNames = "plate_number")
        },
        indexes = {
                @Index(name = "IX_cars_user_id", columnList = "user_id"),
                @Index(name = "IX_cars_brand", columnList = "brand"),
                @Index(name = "IX_cars_model", columnList = "model")
        }
)
public class CarEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "brand", nullable = false, length = 80)
    private String brand;

    @Column(name = "model", nullable = false, length = 80)
    private String model;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "plate_number", nullable = false, length = 20)
    private String plateNumber;

    @Column(name = "color", nullable = false, length = 50)
    private String color;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "FK_cars_users"))
    private UserEntity user;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
