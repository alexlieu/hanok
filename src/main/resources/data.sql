-- Populate Person table
INSERT INTO person (first_name, last_name, email, phone_number, role) VALUES
    ('Irving', 'Bailiff', 'irving.b@lumon.com', '1234567890', 'CUSTOMER'),
    ('Dylan', 'George', 'dylan.g@lumon.com', '1234567890', 'CUSTOMER'),
    ('Mark', 'Scout', 'mark.s@lumon.com', '1234567890', 'CUSTOMER'),
    ('Helena', 'Eagan', 'helly.r@lumon.com', '1234567890', 'ADMIN'),
    ('Seth', 'Milchick', 'milkshake@lumon.com', '0987654321', 'STAFF'),
    ('Harmony', 'Cobel', 'cobel@lumon.com', '1122334455', 'STAFF');

-- Populate Product table
INSERT INTO product (name, category, base_price, description) VALUES
    ('Cream Cheese Rice Brownies', 'BROWNIE', 16, 'Chewy and sweet brownies made with rice and cream cheese sauce on top.'),
    ('Rice Castella', 'CASTELLA', 16, 'Soft and delicate Japanese sponge cake made with rice and bean paste'),
    ('Brownie Set', 'BROWNIE', 16, 'Includes: 2 pieces of vegan chocolate, 2 pieces of cheese & rice, 2 pieces of matcha.'),
    ('Injeolmi', 'RICE_CAKE', 16, 'Perfectly soft, chewy and nutty rice cakes coated in delicately sweet bean powder.');


INSERT INTO product (name, category, base_price, description, active) VALUES
    ('I am not here', 'BROWNIE', 2, 'I am not here...', false);

-- Populate ProductVariant table
INSERT INTO product_variant (product_id, price, size, flavour) VALUES
    (4, 7, 'REGULAR', 'PLAIN'),
    (4, 10, 'LARGE', 'PLAIN'),
    (4, 7.5, 'REGULAR', 'MUGWORT'),
    (4, 10.5, 'LARGE', 'MUGWORT'),
    (1, 16, 'REGULAR', 'PLAIN'),
    (2, 16, 'REGULAR', 'PLAIN'),
    (3, 16, 'REGULAR', 'PLAIN'),
    (5, 16, 'REGULAR', 'PLAIN');

-- Populate CustomerOrder table
INSERT INTO customer_order (customer_id, order_status, order_date_time, pickup_date_time) VALUES
    (1, 'PENDING', '2025-03-08T10:00:00', '2025-03-08T14:00:00'),
    (1, 'PREPARING', '2025-03-09T10:00:00', '2025-03-10T14:00:00'),
    (2, 'COMPLETED', '2025-03-07T11:00:00', '2025-03-07T15:00:00');

-- Populate OrderItem table
INSERT INTO order_item (order_id, variant_id, quantity) VALUES
    (1, 1, 1),
    (1, 4, 1),
    (2, 5, 1),
    (3, 6, 2);