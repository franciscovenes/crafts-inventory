-- ==========================
-- TYPES
-- ==========================

INSERT INTO types (name)
VALUES
('Ring'),
('Bracelet'),
('Necklace'),
('Purse'),
('Headband');

-- ==========================
-- STATES
-- ==========================

INSERT INTO states (name)
VALUES
('In Stock'),
('In production'),
('Sold'),
('Being restored');

-- ==========================
-- CONDITIONS
-- ==========================

INSERT INTO conditions (name)
VALUES
('Good'),
('Restoration required');

-- ==========================
-- ARTISANS
-- ==========================
INSERT INTO artisans (name)
VALUES
    ('Emma Carter'),
    ('James Walker'),
    ('Olivia Bennett'),
    ('Daniel Brooks'),
    ('Sophia Reed');

-- ==========================
-- MODELS
-- ==========================
INSERT INTO models (name)
VALUES
    ('Tuscan Sunlight'),
    ('Andean Forest'),
    ('Ocean Whisper'),
    ('Desert Bloom'),
    ('Midnight Garden');

-- ==========================
-- COLORS
-- ==========================
INSERT INTO colors (name)
VALUES
    ('Gold'),
    ('Silver'),
    ('Copper'),
    ('Black'),
    ('White'),
    ('Blue'),
    ('Green'),
    ('Red'),
    ('Purple'),
    ('Turquoise');

-- ==========================
-- ITEMS
-- ==========================

INSERT INTO items ( 
    model_id, 
    type_id, 
    artisan_id, 
    condition_id, 
    state_id, 
    price, 
    length_cm, 
    width_cm, 
    production_hours, 
    location 
) 
VALUES 
(1, 1, 3, 1, 1, 450.00, 2.20, 2.00, 14.50, 'Main workshop'), 
(2, 2, 1, 1, 1, 780.00, 18.50, 1.50, 22.75, 'London gallery'), 
(3, 3, 4, 1, 3, 1250.00, 45.00, 3.00, 36.00, NULL), 
(4, 4, 2, 2, 4, 320.00, 25.00, 12.00, 18.50, 'Restoration studio'), 
(5, 5, 5, 1, 2, 980.00, 30.00, 8.00, 28.25, NULL), 

(1, 2, 2, 1, 1, 560.00, 20.00, 1.20, 17.00, 'Main workshop'), 
(2, 1, 5, 1, 3, 1500.00, 2.80, 2.50, 42.50, NULL), 
(3, 4, 3, 2, 4, 275.00, 15.00, 10.00, 7.25, 'Restoration studio'), 
(4, 3, 1, 1, 1, 2100.00, 50.00, 4.00, 65.00, 'Paris showroom'), 
(5, 2, 4, 1, 2, 890.00, 19.00, 1.80, 31.50, NULL), 

(2, 5, 3, 1, 1, 430.00, 12.00, 5.00, 13.75, 'Main workshop'), 
(3, 1, 5, 2, 4, 670.00, 3.00, 2.60, 19.00, 'Restoration studio'), 
(4, 2, 2, 1, 1, 1350.00, 21.00, 1.40, 38.25, 'London gallery'), 
(1, 4, 4, 1, 2, 760.00, 28.00, 11.00, 24.00, NULL), 
(5, 3, 1, 2, 3, 3200.00, 55.00, 5.00, 90.50, NULL);

-- ==========================
-- ITEM COLORS
-- ==========================

INSERT INTO item_colors (
    item_id,
    color_id
)
VALUES
    -- Item 1: Tuscan Sunlight Ring
    (1, 1),
    (1, 2),

    -- Item 2: Andean Forest Bracelet
    (2, 2),
    (2, 7),

    -- Item 3: Ocean Whisper Necklace
    (3, 6),
    (3, 10),

    -- Item 4: Desert Bloom Purse
    (4, 3),
    (4, 8),

    -- Item 5: Midnight Garden Headband
    (5, 4),
    (5, 9),

    -- Item 6: Tuscan Sunlight Bracelet
    (6, 1),
    (6, 7),
    (6, 10),

    -- Item 7: Andean Forest Ring
    (7, 2),
    (7, 4),

    -- Item 8: Ocean Whisper Purse
    (8, 5),
    (8, 6),

    -- Item 9: Desert Bloom Necklace
    (9, 1),
    (9, 3),
    (9, 8),

    -- Item 10: Midnight Garden Bracelet
    (10, 2),
    (10, 10),

    -- Item 11: Andean Forest Headband
    (11, 7),
    (11, 9),

    -- Item 12: Ocean Whisper Ring
    (12, 4),
    (12, 8),

    -- Item 13: Desert Bloom Bracelet
    (13, 1),
    (13, 2),

    -- Item 14: Tuscan Sunlight Purse
    (14, 5),
    (14, 6),
    (14, 7),

    -- Item 15: Midnight Garden Necklace
    (15, 3),
    (15, 9);