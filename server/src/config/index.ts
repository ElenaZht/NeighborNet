import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

const { 
  PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, 
  PORT, 
  ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET,
  ACCESS_DEFAULT_MAX_AGE, REFRESH_DEFAULT_MAX_AGE
} = process.env;

// Validate required environment variables
if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
  throw new Error('Missing required database environment variables');
}

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error('Missing JWT secret environment variables');
}

export const config = {
  database: {
    host: PGHOST,
    port: PGPORT ? parseInt(PGPORT) : 5432,
    user: PGUSER,
    database: PGDATABASE,
    password: PGPASSWORD,
    ssl: { rejectUnauthorized: false },
  },
  server: {
    port: PORT ? parseInt(PORT) : 3001,
  },
  jwt: {
    accessTokenSecret: ACCESS_TOKEN_SECRET,
    refreshTokenSecret: REFRESH_TOKEN_SECRET,
    accessTokenMaxAge: ACCESS_DEFAULT_MAX_AGE || '15m',
    refreshTokenMaxAge: REFRESH_DEFAULT_MAX_AGE || '7d',
  },
};
