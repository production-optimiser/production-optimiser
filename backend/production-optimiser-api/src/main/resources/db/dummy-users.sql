-- Password for all users is 'password123' (pre-hashed with BCrypt)
INSERT INTO users (id, email, password, role, created_at, updated_at)
VALUES
    -- Admin users
    ('550e8400-e29b-41d4-a716-446655440000', 'admin1@example.com', '$2a$12$0/0CAqGeoSyuDRL03LoxM.F6KUdri1LAdFkxgFHXMtLEosyeHhA02', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440001', 'admin2@example.com', '$2a$12$0/0CAqGeoSyuDRL03LoxM.F6KUdri1LAdFkxgFHXMtLEosyeHhA02', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    
    -- Customer users
    ('550e8400-e29b-41d4-a716-446655440002', 'customer1@example.com', '$2a$12$0/0CAqGeoSyuDRL03LoxM.F6KUdri1LAdFkxgFHXMtLEosyeHhA02', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440003', 'customer2@example.com', '$2a$12$0/0CAqGeoSyuDRL03LoxM.F6KUdri1LAdFkxgFHXMtLEosyeHhA02', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);