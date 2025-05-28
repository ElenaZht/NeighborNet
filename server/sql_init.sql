-- enable only the core PostGIS features
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder CASCADE;


CREATE TABLE IF NOT EXISTS users (
  id              SERIAL           PRIMARY KEY,
  username        TEXT             UNIQUE NOT NULL,
  email           TEXT             UNIQUE NOT NULL,
  photo_url       TEXT,
  hashed_password TEXT             NOT NULL,
  location        GEOGRAPHY(POINT),
  address         TEXT             -- Added address field
);

-- Example of how to set up cascade deletion in a related table
-- This demonstrates the pattern for any table that references users
CREATE TABLE IF NOT EXISTS example_related_table (
  id              SERIAL       PRIMARY KEY,
  name            TEXT         NOT NULL,
  user_id         INTEGER      NOT NULL,
  -- This foreign key constraint enables cascade deletion
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE



SELECT username, ST_Distance(location, ST_Point(32.010069, 34.800074)::GEOGRAPHY) AS distance
FROM users
WHERE ST_DWithin(location, ST_Point(32.010069, 34.800074)::GEOGRAPHY , 11000);


CREATE TABLE issue_reports (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    userid INTEGER NOT NULL,
    username VARCHAR(255) NOT NULL,
    img_url VARCHAR(2048),
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    location GEOGRAPHY(POINT),  -- Added location coordinates
    address TEXT,               -- Added address field
    upvotes INTEGER DEFAULT 0,
    followers INTEGER DEFAULT 0,
    verifies INTEGER DEFAULT 0,
    neighborhood_id INTEGER,
    city VARCHAR(255)
);

CREATE TABLE give_aways (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    userid INTEGER NOT NULL,
    username VARCHAR(255) NOT NULL,
    img_url VARCHAR(2048),
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    location GEOGRAPHY(POINT),  
    address TEXT,
    is_free BOOLEAN DEFAULT TRUE,
    swap_options TEXT,
    neighborhood_id INTEGER,
    city VARCHAR(255)
);

CREATE TABLE offer_help (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    userid INTEGER NOT NULL,
    username VARCHAR(255) NOT NULL,
    img_url VARCHAR(2048),
    topic VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    location GEOGRAPHY(POINT),  
    address TEXT,
    barter_options TEXT,
    followers INTEGER DEFAULT 0,
    neighborhood_id INTEGER,
    city VARCHAR(255)
);

CREATE TABLE help_requests (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    userid INTEGER NOT NULL,
    username VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    img_url VARCHAR(2048),
    location GEOGRAPHY(POINT),
    address TEXT,
    category VARCHAR(50) NOT NULL,
    urgency VARCHAR(10) DEFAULT 'normal',
    followers INTEGER DEFAULT 0
);
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    report_id INTEGER NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    img_url VARCHAR(255)
);

SELECT id, nbr_name, nbr_name_en, city_name, city_name_en, city_gov_id 
FROM neighborhoods 
WHERE ST_Contains(geometry, ST_SetSRID(ST_Point(34.881587, 31.961376), 4326));