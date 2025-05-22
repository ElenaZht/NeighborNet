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

  
INSERT INTO users (username, email, photo_url, hashed_password, location, address)
VALUES (
  'dima',
  'di@example.com',
  'https://example.com/photo.jpg',
  'YourPassword123',
  ST_Point(32.021927, 34.739566),
  'Rothschild Blvd 123, Tel Aviv, Israel'
);



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
    verifies INTEGER DEFAULT 0
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
    swap_options TEXT
);