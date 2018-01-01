import { Client, Pool, PoolConfig, QueryResult } from 'pg';
import { injectable } from "inversify";
import { container } from "../container";

export const LOG_DATABASE_QUERIES = 'LOG_DATABASE_QUERIES';
export const SOLID_DATABASE_CONNECTION = 'SOLID_DATABASE_CONNECTION';

const poolConfig: PoolConfig = {};

if (process.env[SOLID_DATABASE_CONNECTION] !== undefined) {
  poolConfig.connectionString = process.env[SOLID_DATABASE_CONNECTION];
}

const pool = new Pool(poolConfig);

export function query(queryText: string, values?: any[]): Promise<QueryResult> {
  if (!process.env[LOG_DATABASE_QUERIES]) {
    return pool.query(queryText, values);
  }

  const start = Date.now();
  return pool.query(queryText, values).then((result) => {
    const duration = Date.now() - start;
    console.log('executed query', { queryText, duration, rows: result.rowCount });
    return result;
  });
}

export function getClient(callback: (err: Error, client: Client, done: () => void) => void) {
  pool.connect((err, client, done) => {
    const query = client.query.bind(client);
    const patched = <any> client;

    // monkey patch the query method to keep track of the last query executed
    patched.query = (...args: any[]) => {
      query.lastQuery = args;
      query(...args);
    };

    // set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(
      () => {
        console.error('A client has been checked out for more than 5 seconds!');
        console.error('The last executed query on this client was:', query.lastQuery);
      },
      5000,
    );

    const release = () => {
      // call the actual 'done' method, returning this client to the pool
      done();

      // clear our timeout
      clearTimeout(timeout);

      // set the query method back to its old un-monkey-patched version
      patched.query = query;
    };

    callback(err, client, release);
  });
}

@injectable()
export class Database {

  /**
   * Queries the database.
   *
   * See https://node-postgres.com/features/queries#parameterized-query
   *
   * @param {string} queryText
   * @param {any[]} values
   * @returns {Promise<QueryResult>}
   */
  query(queryText: string, values?: any[]): Promise<QueryResult> {
    return query(queryText, values);
  }

  /**
   * Closes the underlying connection pool by draining active clients. Useful only upon shutdown of the application
   * or at the end of a script.
   *
   * See https://node-postgres.com/api/pool#pool-end
   *
   * @returns {Promise<void>}
   */
  close(): Promise<void> {
    return pool.end();
  }
}

container.bind<Database>(Database).to(Database);