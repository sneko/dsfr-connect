import { Option, program } from 'commander';
import concurrently from 'concurrently';
import path from 'path';

import { getFrameworkFolderPath } from '@dsfrc/docs/utils';
import { Target, frameworks, mainTarget } from '@dsfrc/docs/utils/targets';

interface CommandOptions {
  frameworks?: string[];
  framework?: boolean;
  main?: boolean;
}

interface TargetCommand {
  target: Target;
  command: string;
  env?: Record<string, unknown>;
}

const actions = ['dev', 'build', 'start', 'prepare', 'download', 'extract', 'lint', 'lint:es', 'lint:ts'];

const lintEsCommand = 'TIMING=1 pnpm eslint --ext .js,.jsx,.ts,.tsx,.mdx .';
const lintTsCommand = 'pnpm tsc --noEmit --incremental false';
const lintCommand = `${lintEsCommand} && ${lintTsCommand}`;

program
  .addOption(new Option('-f, --frameworks <frameworks...>', 'Frameworks to use').choices(frameworks.map((f) => f.name)))
  .option('-nf, --no-framework', 'Exclude all frameworks')
  .option('-nm, --no-main', 'Exclude main Storybook')
  .arguments('<action>')
  .action(async (action) => {
    if (!actions.includes(action)) {
      console.error('Invalid action. Available actions:', actions.join(', '));
      process.exit(1);
    }

    const options = program.opts<CommandOptions>();
    const targetsMain = options.main === true;

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
          ...(targetsMain
            ? [
                {
                  target: mainTarget,
                  // With "dev" if launching concurrently the instance referencing others will fail with CORS issue... just adding
                  // delay solves this... which is weird :/ . Maybe the server does a specific call different then a browser visit
                  // and change the CORS configuration. We did avoid sharing the same cache, don't understand know what could be the cause.
                  // Ref: https://github.com/storybookjs/storybook/issues/12108#issuecomment-1564231780
                  command: `sleep 3 && cd ${mainFolderPath} && storybook dev -p ${mainTarget.port} --no-open`,
                  env: {
                    SELECTED_FRAMEWORKS: selectedFrameworks.map((f) => f.name).join(','),
                  },
                },
              ]
            : []),
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
          ...(targetsMain
            ? [
                {
                  target: mainTarget,
                  // The first intent was to output in `/dist/` directly but it was messing with others in `/dist/frameworks/*`
                  // So use a subdirectory for the build and add a redirection file (`index.html`) after the build to easily allow using root URL
                  command: `cd ${mainFolderPath} && storybook build --output-dir ${mainFolderPath}/dist/main`,
                  env: {
                    SELECTED_FRAMEWORKS: selectedFrameworks.map((f) => f.name).join(','),
                  },
                },
              ]
            : []),
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
          ...(targetsMain
            ? [
                {
                  target: mainTarget,
                  command: `http-server -p ${mainTarget.port} ${mainFolderPath}/dist`,
                },
              ]
            : []),
          ...selectedFrameworks.map((framework) => ({
            target: framework,
            command: `http-server -p ${framework.port} ${mainFolderPath}/dist/frameworks/${framework.name}`,
          })),
        ];

        await executeParallelCommands(selectedFrameworks, action, commands);

        break;
      case 'prepare':
        await Promise.all([
          targetsMain
            ? (async () => {
                await mainTarget.download();
                await mainTarget.extract();
              })()
            : Promise.resolve(),
          ...selectedFrameworks.map(async (framework) => {
            await framework.download();
            await framework.extract();
          }),
        ]);
        break;
      case 'download':
        await Promise.all([
          targetsMain ? mainTarget.download() : Promise.resolve(),
          ...selectedFrameworks.map(async (framework) => framework.download()),
        ]);
        break;
      case 'extract':
        await Promise.all([
          targetsMain ? mainTarget.extract() : Promise.resolve(),
          ...selectedFrameworks.map(async (framework) => framework.extract()),
        ]);
        break;
      case 'lint':
        commands = [
          ...(targetsMain
            ? [
                {
                  target: mainTarget,
                  command: `cd ${mainFolderPath} && ${lintCommand}`,
                },
              ]
            : []),
          ...selectedFrameworks.map((framework) => ({
            target: framework,
            command: `cd ${getFrameworkFolderPath(mainFolderPath, framework.name)} && ${lintCommand}`,
          })),
        ];

        await executeParallelCommands(selectedFrameworks, action, commands);

        break;
      case 'lint:es':
        commands = [
          ...(targetsMain
            ? [
                {
                  target: mainTarget,
                  command: `cd ${mainFolderPath} && ${lintEsCommand}`,
                },
              ]
            : []),
          ...selectedFrameworks.map((framework) => ({
            target: framework,
            command: `cd ${getFrameworkFolderPath(mainFolderPath, framework.name)} && ${lintEsCommand}`,
          })),
        ];

        await executeParallelCommands(selectedFrameworks, action, commands);

        break;
      case 'lint:ts':
        commands = [
          ...(targetsMain
            ? [
                {
                  target: mainTarget,
                  command: `cd ${mainFolderPath} && ${lintTsCommand}`,
                },
              ]
            : []),
          ...selectedFrameworks.map((framework) => ({
            target: framework,
            command: `cd ${getFrameworkFolderPath(mainFolderPath, framework.name)} && ${lintTsCommand}`,
          })),
        ];

        await executeParallelCommands(selectedFrameworks, action, commands);

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
    env: targetCommand.env,
  }));

  await concurrently(enhancedCommands, {
    raw: false, // "raw" would allow having the command output colors, but it's not compatible with using the prefix unfortunately...
  }).result;
}
