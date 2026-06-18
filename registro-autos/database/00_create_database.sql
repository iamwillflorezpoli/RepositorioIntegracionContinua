IF DB_ID('car_registry_db') IS NULL
BEGIN
    CREATE DATABASE car_registry_db;
END;
GO