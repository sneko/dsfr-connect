import { Option, program } from 'commander';
import concurrently from 'concurrently';
import path from 'path';

import { getFrameworkFolderPath } from '@dsfrc/docs/utils';
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

    const mainFolderPath = path.resolve(__dirname, '../');

    let commands: TargetCommand[] | undefined;
    switch (action) {
      case 'dev':
        commands = [
          {
            target: mainTarget,
            command: `storybook dev -p ${mainTarget.port} -c ${mainFolderPath}/.storybook --no-open`,
          },
          ...selectedFrameworks.map((framework) => ({
            target: framework,
            // To avoid cache concurrency we need to run `storybook` in the dedicated folder (no cross-call)
            command: `cd ${getFrameworkFolderPath(mainFolderPath, framework.name)} && storybook dev -p ${framework.port} --no-open`,
          })),
        ];

        await executeParallelCommands(selectedFrameworks, action, commands);

        break;
      case 'build':
        commands = [
          {
            target: mainTarget,
            // The first intent was to output in `/dist/` directly but it was messing with others in `/dist/frameworks/*`
            // So use a subdirectory for the build and add a redirection file (`index.html`) after the build to easily allow using root URL
            command: `cd ${mainFolderPath} && storybook build --output-dir ${mainFolderPath}/dist/main`,
          },
          ...selectedFrameworks.map((framework) => ({
            target: framework,
            // To avoid cache concurrency we need to run `storybook` in the dedicated folder (no cross-call)
            command: `cd ${getFrameworkFolderPath(
              mainFolderPath,
              framework.name
            )} && storybook build --output-dir ${mainFolderPath}/dist/frameworks/${framework.name}`,
          })),
        ];

        await executeParallelCommands(selectedFrameworks, action, commands);

        // As mentioned above, add the index redirection file
        await concurrently([
          { command: `cp ${path.resolve(mainFolderPath, './utils/storybook/dist-index.html')} ${path.resolve(mainFolderPath, './dist/index.html')}` },
        ]).result;

        break;
      case 'start':
        commands = [
          {
            target: mainTarget,
            command: `serve -l ${mainTarget.port} ${mainFolderPath}/dist`,
          },
          ...selectedFrameworks.map((framework) => ({
            target: framework,
            command: `serve -l ${framework.port} ${mainFolderPath}/dist/frameworks/${framework.name}`,
          })),
        ];

        await executeParallelCommands(selectedFrameworks, action, commands);

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