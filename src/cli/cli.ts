import 'dotenv/config';
import 'reflect-metadata';

import * as commander from 'commander'

import { container } from '../container';
import { COMMAND, CommandDefinition } from "./commands";

import { ListCommand } from '../commands';
import { DatabaseConnectionCommand } from "../database/commands";
import { DatabaseMigrateCommand } from "../database/migrations/commands";

{
  // ಠ益ಠ
  // don't tree-shake me
  ListCommand;
  DatabaseConnectionCommand;
  DatabaseMigrateCommand;
}

const commands: CommandDefinition[] = container.getAll(COMMAND);

process.title = 'solid';
process.on('unhandledRejection', error =>
  console.error('Unhandled rejection:', error));

commander
  .version('0.0.1')
  .description('Solid');

commands.forEach(command => {
  commander.command(command.name)
    .description(command.description)
    .action(async () => {
      await command.execute()
        .catch(error => {
          console.error(error.message);
          process.exit(1);
        })
        .then(_ => process.exit());
    });
});

commander.on('command:*', args => {
  console.error('Unknown command', args[0]);
  process.exit(1);
});

if (!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit();
}
commander.parse(process.argv);
