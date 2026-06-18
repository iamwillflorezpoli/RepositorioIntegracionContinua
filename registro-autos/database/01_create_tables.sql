USE car_registry_db;
GO

IF OBJECT_ID('dbo.cars', 'U') IS NOT NULL
BEGIN
    DROP TABLE dbo.cars;
END;
GO

IF OBJECT_ID('dbo.users', 'U') IS NOT NULL
BEGIN
    DROP TABLE dbo.users;
END;
GO

CREATE TABLE dbo.users (
    id BIGINT IDENTITY(1,1) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CONSTRAINT DF_users_role DEFAULT 'ROLE_USER',
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_users_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NULL,

    CONSTRAINT PK_users PRIMARY KEY (id),
    CONSTRAINT UK_users_email UNIQUE (email),
    CONSTRAINT CK_users_role CHECK (role IN ('ROLE_USER'))
);
GO

CREATE TABLE dbo.cars (
    id BIGINT IDENTITY(1,1) NOT NULL,
    brand VARCHAR(80) NOT NULL,
    model VARCHAR(80) NOT NULL,
    [year] INT NOT NULL,
    plate_number VARCHAR(20) NOT NULL,
    color VARCHAR(50) NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_cars_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2(0) NULL,

    CONSTRAINT PK_cars PRIMARY KEY (id),
    CONSTRAINT UK_cars_plate_number UNIQUE (plate_number),
    CONSTRAINT FK_cars_users FOREIGN KEY (user_id) REFERENCES dbo.users(id),
    CONSTRAINT CK_cars_year CHECK ([year] >= 1900)
);
GO

CREATE INDEX IX_cars_user_id ON dbo.cars(user_id);
GO

CREATE INDEX IX_cars_brand ON dbo.cars(brand);
GO

CREATE INDEX IX_cars_model ON dbo.cars(model);
GO