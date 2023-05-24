import { Option, program } from 'commander';
import concurrently from 'concurrently';

import { Target, frameworks, mainTarget } from '@dsfrc/docs/utils/targets';

interface CommandOptions {
  frameworks?: string[];
  framework?: boolean;
}

interface TargetCommand {
  target: Target;
  command: string;
}

const actions = ['dev', 'build', 'start', 'prepare', 'download', 'extract'];

program
  .addOption(new Option('-f, --frameworks <frameworks...>', 'Frameworks to use').choices(frameworks.map((f) => f.name)))
  .option('-nf, --no-framework', 'Exclude all frameworks')
  .arguments('<action>')
  .action(async (action) => {
    if (!actions.includes(action)) {
      console.error('Invalid action. Available actions:', actions.join(', '));
      process.exit(1);
    }

    const options = program.opts<CommandOptions>();

    let selectedFrameworks: Target[];
    if (options.frameworks && options.frameworks.length > 0) {
      selectedFrameworks = frameworks.filter((framework) => options.frameworks?.includes(framework.name));
    } else if (options.framework === false) {
      selectedFrameworks = [];
    } else {
      selectedFrameworks = frameworks;
    }

    let commands: TargetCommand[] | undefined;
    switch (action) {
      case 'dev':
        commands = [
          {
            target: mainTarget,
            command: `storybook dev -p ${mainTarget.port} --no-open`,
          },
          ...selectedFrameworks.map((framework) => ({
            target: framework,
            command: `storybook dev -p ${framework.port} -c .storybook/frameworks/${framework.name} --no-open`,
          })),
        ];
        break;
      case 'build':
        commands = [
          {
            target: mainTarget,
            command: 'storybook build --output-dir dist',
          },
          ...selectedFrameworks.map((framework) => ({
            target: framework,
            command: `storybook build -c .storybook/frameworks/${framework.name} --output-dir dist/frameworks/${framework.name}`,
          })),
        ];
        break;
      case 'start':
        commands = [
          {
            target: mainTarget,
            command: `serve -l ${mainTarget.port}`,
          },
          ...selectedFrameworks.map((framework) => ({
            target: framework,
            command: `serve -l ${framework.port} dist/frameworks/${framework.name}`,
          })),
        ];
        break;
      case 'prepare':
        await Promise.all([
          (async () => {
            await mainTarget.download();
            await mainTarget.extract();
          })(),
          ...selectedFrameworks.map(async (framework) => {
            await framework.download();
            await framework.extract();
          }),
        ]);
        break;
      case 'download':
        await Promise.all([mainTarget.download(), ...selectedFrameworks.map(async (framework) => framework.download())]);
        break;
      case 'extract':
        await Promise.all([mainTarget.extract(), ...selectedFrameworks.map(async (framework) => framework.extract())]);
        break;
    }

    if (commands) {
      await executeParallelCommands(selectedFrameworks, action, commands);
    }
  })
  .parse(process.argv);

if (!program.args.length) {
  console.error('No action specified. Available actions:', actions.join(', '));
  process.exit(1);
}

async function executeParallelCommands(frameworks: Target[], action: string, targetCommands: TargetCommand[]) {
  const enhancedCommands = targetCommands.map((targetCommand) => ({
    name: targetCommand.target.terminalFormatter(`${targetCommand.target.name}:${action}`),
    command: targetCommand.command,
  }));

  await concurrently(enhancedCommands, {
    raw: false, // "raw" would allow having the command output colors, but it's not compatible with using the prefix unfortunately...
  }).result;
}
