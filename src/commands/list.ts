import { COMMAND, Command, CommandDefinition, Executable } from "../cli";
import { container } from '../container';

@Command({
  name: 'list',
  description: 'List available commands'
})
export class ListCommand implements Executable {
  async execute() {
    const commands: CommandDefinition[] = container.getAll(COMMAND);
    commands.forEach(command => {
      console.log(`${command.name}\t${command.description}`);
    });
  }
}