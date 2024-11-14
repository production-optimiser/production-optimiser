-- Password for all users is 'password123' (pre-hashed with BCrypt)
INSERT INTO users (id, email, password, role, created_at, updated_at)
VALUES
    -- Admin users (pass same as email)
    ('550e8400-e29b-41d4-a716-446655440000', 'admin1', '$2a$12$CSwy1e7bK1sJYWItyYy.2.tQbFzjdZbwqC7tXM8.l1NQIwauoSK96', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440001', 'admin2', '$2a$12$KbzVok/dEndwZDChEoQHdeoxpl8/GvMFw8gOW.E0Fk5jAcI.XYXBu', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    
    -- Customer users
    ('550e8400-e29b-41d4-a716-446655440002', 'customer1', '$2a$12$Y.GEuz92Mx5jxpJT3bukaOHqYUkStapCybkxG2DfNh5f39iRhGo2O', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440003', 'customer2', '$2a$12$.H7XfyXtuCWZfay5bLAqROLh.kb1Coio2pRoQLtI4ZvEp5LL11XE.', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO optimization_models (id, name, created_at, updated_at, api_url)
VALUES
    ('550e8400-e29b-41d4-a716-446655440004', 'Model 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'http://localhost:8080/api/v1/optimization-models/550e8400-e29b-41d4-a716-446655440004'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Model 2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'http://localhost:8080/api/v1/optimization-models/550e8400-e29b-41d4-a716-446655440005'),
    ('550e8400-e29b-41d4-a716-446655440006', 'Model 3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'http://localhost:8080/api/v1/optimization-models/550e8400-e29b-41d4-a716-446655440006'),
    ('550e8400-e29b-41d4-a716-446655440007', 'Model 4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'http://localhost:8080/api/v1/optimization-models/550e8400-e29b-41d4-a716-446655440007'),
    ('550e8400-e29b-41d4-a716-446655440008', 'Model 5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'http://localhost:8080/api/v1/optimization-models/550e8400-e29b-41d4-a716-446655440008');

INSERT INTO optimization_results (id, created_at, updated_at, notes, plt_data, user_id)
VALUES
    ('550e8400-e29b-41d4-a716-446655440009', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Notes 1', NULL, '550e8400-e29b-41d4-a716-446655440002'),
    ('550e8400-e29b-41d4-a716-446655440010', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Notes 2', NULL, '550e8400-e29b-41d4-a716-446655440002'),
    ('550e8400-e29b-41d4-a716-446655440011', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Notes 3', NULL, '550e8400-e29b-41d4-a716-446655440002'),
    ('550e8400-e29b-41d4-a716-446655440012', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Notes 4', NULL, '550e8400-e29b-41d4-a716-446655440002'),
    ('550e8400-e29b-41d4-a716-446655440013', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Notes 5', NULL, '550e8400-e29b-41d4-a716-446655440002'),

    ('550e8400-e29b-41d4-a716-446655440014', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Notes 1', NULL, '550e8400-e29b-41d4-a716-446655440003'),
    ('550e8400-e29b-41d4-a716-446655440015', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Notes 2', NULL, '550e8400-e29b-41d4-a716-446655440003'),
    ('550e8400-e29b-41d4-a716-446655440016', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Notes 3', NULL, '550e8400-e29b-41d4-a716-446655440003'),
    ('550e8400-e29b-41d4-a716-446655440017', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Notes 4', NULL, '550e8400-e29b-41d4-a716-446655440003'),
    ('550e8400-e29b-41d4-a716-446655440018', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Notes 5', NULL, '550e8400-e29b-41d4-a716-446655440003');

INSERT INTO users_optimization_models (user_id, optimization_model_id)
VALUES
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004'),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005'),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006'),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007'),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008'),

    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004'),
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005'),
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006'),
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007'),
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008');