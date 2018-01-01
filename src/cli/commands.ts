import { container } from '../container';

export const commands: CommandDefinition[] = [];
export const COMMAND = Symbol.for('Command');

export interface CommandDefinition {
  name: string;
  description?: string;
  execute: () => Promise<any>;
}

export interface CommandMeta {
  name: string;
  description?: string;
}

export interface Executable {
  execute: () => Promise<any>;
}

export function Command(meta: CommandMeta): ClassDecorator {
  return (target: any) => {
    const command: CommandDefinition = {
      ...meta,
      execute: <() => Promise<boolean>> (new target)['execute']
    };

    container.bind<CommandDefinition>(COMMAND)
      .toConstantValue(command)
      .whenTargetNamed(command.name);
    return target;
  };
}
