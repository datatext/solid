import { Command, Executable } from '../../../cli';
import { injectable } from "inversify";
import { Migrations } from "../migrations";

@Command({
  name: 'database:migrate',
  description: 'Test and display details about the database connection'
})
@injectable()
export class DatabaseMigrateCommand implements Executable {

  constructor(private migrations: Migrations) {
  }

  async execute() {
    console.log("db:migrate");
    console.log("migrations: ", this.migrations);
    await this.migrations.migrate();
  }
}