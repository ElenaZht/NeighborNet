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