import { Command, Executable } from '../../cli';
import { query, SOLID_DATABASE_CONNECTION } from '../database';
import { defaults } from 'pg';

@Command({
  name: 'database:connection',
  description: 'Test and display details about the database connection'
})
export class DatabaseConnectionCommand implements Executable {
  async execute() {
    return await query('SELECT current_database()')
      .then(result => {
        const database = result.rows[0].current_database;
        console.log(`✓ Connected to database "${database}"`)
      })
      .catch(error => {
        const simpleParams = ['PGHOST', 'PGDATABASE', 'PGUSER', 'PGPASSWORD'];
        const connectionString = process.env[SOLID_DATABASE_CONNECTION];

        let errorMessage = 'Failed to connect to database.\n';

        if (connectionString !== undefined) {
          errorMessage += `Connection string:
  ${connectionString}`
        } else {
          errorMessage += `Environment variables: ${simpleParams.map(param => `
  ${param}=${process.env[param] || ''}`).join('')}`
        }

        errorMessage += `

Connection defaults: ${Object.keys(defaults).map(k => `
  ${k}=${(<any> defaults)[k] || ''}`).join('')}

Error: ${error.message}`;

        throw Error(errorMessage);
      });
  }
}