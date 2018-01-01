import { injectable } from "inversify";
import { Database } from "../database";
import { container } from "../../container";

@injectable()
export class Migrations {

  private static TABLE = "schema_versions";

  constructor(private database: Database) {
  }

  async migrate(): Promise<void> {
    const exists = await this.hasSchemaVersionTable('public');
    console.log('Schema version table exists ?', exists);
  }

  async hasSchemaVersionTable(schema: string): Promise<boolean> {
    return this.database.query(`
SELECT EXISTS (
  SELECT 1 
  FROM   pg_tables
  WHERE  schemaname = $1
  AND    tablename = $2
);`,
      [schema, Migrations.TABLE])
      .then(result => result.rows[0].exists);
  }
}

container.bind<Migrations>(Migrations).to(Migrations).inSingletonScope();
