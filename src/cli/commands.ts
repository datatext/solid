import { container } from '../container';

export const commands: CommandDefinition[] = [];
export const COMMAND = Symbol.for('Command');

export interface CommandMeta {
  name: string;
  description?: string;
}

export interface Executable {
  execute: () => Promise<any>;
}

export interface CommandDefinition extends CommandMeta, Executable {
}

/**
 * Defines a solid CLI command
 *
 * @param {CommandMeta} meta the command meta definition for the annotated command class
 */
export function Command(meta: CommandMeta): ClassDecorator {
  return (target: any) => {

    let instance;
    try {
      // First, try to bind then get the command instance from the container (assume annotated with @injectable)
      container.bind(target).to(target);
      instance = container.get(target);
    } catch (error) {
      // Command was not annotated with @injectable, let's try a no-arg constructor ...
      instance = new target;
    }

    // TODO:
    // check for existence of the execute method, throw if absent

    const execute = (<any>instance) ['execute'].bind(instance);

    const command: CommandDefinition = {
      ...meta,
      execute: <() => Promise<boolean>> execute
    };

    // Register the command definition against the container

    container.bind<CommandDefinition>(COMMAND)
      .toConstantValue(command)
      .whenTargetNamed(command.name);

    return target;
  };
}
