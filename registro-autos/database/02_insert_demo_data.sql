cundo USE car_registry_db;
GO

DECLARE @demo_user_id BIGINT;

IF NOT EXISTS (
    SELECT 1
    FROM dbo.users
    WHERE email = 'demo@registroautos.com'
)
BEGIN
    INSERT INTO dbo.users (
        name,
        email,
        password_hash,
        role
    )
    VALUES (
        'Usuario Demo',
        'demo@registroautos.com',
        '$2y$10$A1ZC/TSAEAOfrTO7xI1krOG6DV6Xl1FGZK3IBtcCGH9KQY/Wco45y',
        'ROLE_USER'
    );
END;

SELECT @demo_user_id = id
FROM dbo.users
WHERE email = 'demo@registroautos.com';

IF NOT EXISTS (
    SELECT 1
    FROM dbo.cars
    WHERE plate_number = 'ABC123'
)
BEGIN
    INSERT INTO dbo.cars (
        brand,
        model,
        [year],
        plate_number,
        color,
        user_id
    )
    VALUES (
        'Toyota',
        'Corolla',
        2020,
        'ABC123',
        'Blanco',
        @demo_user_id
    );
END;

IF NOT EXISTS (
    SELECT 1
    FROM dbo.cars
    WHERE plate_number = 'XYZ789'
)
BEGIN
    INSERT INTO dbo.cars (
        brand,
        model,
        [year],
        plate_number,
        color,
        user_id
    )
    VALUES (
        'Mazda',
        'Mazda 3',
        2022,
        'XYZ789',
        'Gris',
        @demo_user_id
    );
END;
GO