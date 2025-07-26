import knex, { Knex } from 'knex';
import { config } from './index';

export const db: Knex = knex({
  client: 'pg',
  connection: config.database,
});
