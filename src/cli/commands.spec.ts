import { Command, COMMAND, Executable } from './commands';
import { container } from '../container';

@Command({
  name: 'test',
  description: 'Sample command'
})
class TestCommand implements Executable {
  async execute() {
    return Promise.resolve('OK');
  }
}

@Command({
  name: 'failing',
  description: 'Failing command'
})
class FailingCommand implements Executable {
  async execute() {
    return Promise.reject(Error("Failed to execute command"));
  }
}

describe('Commands', () => {
  it('Gets all commands from container', () => {
    const commands = container.getAll(COMMAND);
    expect(commands.length).toBe(2);
  });

  it('Gets test command and executes successfully', async () => {
    const testCommand = container.getNamed(COMMAND, 'test');
    expect(testCommand).toBeDefined();

    const result = await testCommand.execute();

    expect(result).toEqual('OK');
  });

  it('Gets failing command and fails when executing', async () => {
    const failing = container.getNamed(COMMAND, 'failing');
    expect(failing).toBeDefined();

    await failing.execute()
      .then(result => fail('Unexpected result'))
      .catch(error => {
        expect(error.message).toBe("Failed to execute command");
      });
  });
});