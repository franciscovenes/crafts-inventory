CREATE TABLE IF NOT EXISTS models (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS types (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS artisans (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS conditions (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS states (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS colors (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    hex TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);


CREATE TABLE IF NOT EXISTS items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    model_id INTEGER NOT NULL,
    type_id INTEGER NOT NULL,
    artisan_id INTEGER NOT NULL,
    condition_id INTEGER NOT NULL,
    state_id INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    length_cm NUMERIC(5,2) NOT NULL,
    width_cm NUMERIC(5,2) NOT NULL,
    production_hours NUMERIC(5,2) NOT NULL,

    location TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,

    search_vector tsvector,

    CONSTRAINT fk_model 
        FOREIGN KEY(model_id) 
        REFERENCES models(id) 
        ON DELETE RESTRICT,

    CONSTRAINT fk_type 
        FOREIGN KEY(type_id) 
        REFERENCES types(id) 
        ON DELETE RESTRICT,

    CONSTRAINT fk_artisan 
        FOREIGN KEY(artisan_id) 
        REFERENCES artisans(id) 
        ON DELETE RESTRICT,

    CONSTRAINT fk_condition 
        FOREIGN KEY(condition_id) 
        REFERENCES conditions(id) 
        ON DELETE RESTRICT,

    CONSTRAINT fk_state 
        FOREIGN KEY(state_id) 
        REFERENCES states(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT check_price_positive
        CHECK (price >= 0),
    CONSTRAINT check_length_positive
        CHECK (length_cm > 0),
    CONSTRAINT check_width_positive
        CHECK (width_cm > 0),
    CONSTRAINT check_hours_positive
        CHECK (production_hours > 0)
);

CREATE TABLE IF NOT EXISTS item_colors (
    item_id INTEGER NOT NULL,
    color_id INTEGER NOT NULL,

    PRIMARY KEY (item_id, color_id),

    CONSTRAINT fk_item
        FOREIGN KEY(item_id)
        REFERENCES items(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_color
        FOREIGN KEY(color_id)
        REFERENCES colors(id)
        ON DELETE RESTRICT
);

CREATE OR REPLACE VIEW master_data_names 
WITH (security_invoker = true)
AS
SELECT name FROM models
UNION
SELECT name FROM types
UNION
SELECT name FROM artisans
UNION
SELECT name FROM conditions
UNION
SELECT name FROM states
UNION
SELECT name FROM colors;

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'user'
        CHECK (role IN ('user', 'admin')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    display_name TEXT CHECK (char_length(display_name) <= 100) NOT NULL,

    CONSTRAINT fk_profile_user
        FOREIGN KEY (id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

