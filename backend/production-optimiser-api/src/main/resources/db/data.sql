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
    ('550e8400-e29b-41d4-a716-446655440004', 'Model 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'http://localhost:8080/api/models/550e8400-e29b-41d4-a716-446655440004'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Model 2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'http://localhost:8080/api/models/550e8400-e29b-41d4-a716-446655440005'),
    ('550e8400-e29b-41d4-a716-446655440006', 'Model 3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'http://localhost:8080/api/models/550e8400-e29b-41d4-a716-446655440006'),
    ('550e8400-e29b-41d4-a716-446655440007', 'Model 4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'http://localhost:8080/api/models/550e8400-e29b-41d4-a716-446655440007'),
    ('550e8400-e29b-41d4-a716-446655440008', 'Model 5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'http://localhost:8080/api/models/550e8400-e29b-41d4-a716-446655440008');

INSERT INTO optimization_results(
            id,
            created_at,
            updated_at,
            average_initial_total_machine_utilization,
            average_optimized_total_machine_utilization,
            initial_total_production_time,
            optimized_total_production_time,
            percentage_improvement,
            time_improvement,
            total_time_with_excel_pallets,
            total_time_with_optimized_pallets,
            utilization_improvement,
            best_sequence_of_products,
            user_id)
VALUES
    ('550e8400-e29b-41d4-a716-446655440009',
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP,
      31.34,
      49.81,
      816.0,
      513.5,
      37.07,
      302.5,
      513.5,
      513.5,
      18.46,
      'g skibidi skibidi e skibidi g skibidi skibidi b e e d i b b h h g c c c h i c c d f h e d g d d f h d h d d d c d e i b e h b c e g e h b c b f i skibidi skibidi skibidi c b f b f b f f g f c g skibidi g g g h skibidi h i f i i i e i e f i',
     '550e8400-e29b-41d4-a716-446655440002');


INSERT INTO defined_pallets(pallets_count, created_at, updated_at, defined_pallets, id)
	VALUES
	    (10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'skibidi,b,c', '1'),
	    (3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'd,e,f', '2'),
	    (5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'g,h,i', '3'),
	    (10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'skibidi,b,c', '4'),
	    (10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'd,e,f', '5'),
	    (10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'g,h,i', '6');


INSERT INTO optimization_results_maximum_pallets_used(maximum_pallets_used_id, optimization_result_id)
	VALUES ('1', '550e8400-e29b-41d4-a716-446655440009'),
	 ('2', '550e8400-e29b-41d4-a716-446655440009'),
	 ('3', '550e8400-e29b-41d4-a716-446655440009');

INSERT INTO optimization_results_pallets_defined_in_excel(
	pallets_defined_in_excel_id, optimization_result_id)
	VALUES ('4', '550e8400-e29b-41d4-a716-446655440009'),
     ('5', '550e8400-e29b-41d4-a716-446655440009'),
     ('6', '550e8400-e29b-41d4-a716-446655440009');

INSERT INTO graphs(
	graph_type, created_at, updated_at, base64encoded_image, id, result_id)
	VALUES ('OCCUPANCY_GRAPH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'fake string', '1', '550e8400-e29b-41d4-a716-446655440009'),
	 ('MACHINE_UTILIZATION', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'fake string', '2', '550e8400-e29b-41d4-a716-446655440009'),
	 ('PRODUCT_FLOW', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'fake string', '3', '550e8400-e29b-41d4-a716-446655440009');


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
