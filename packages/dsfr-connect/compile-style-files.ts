import concurrently from 'concurrently';
import fs from 'fs-extra';
import { glob } from 'glob';
import path from 'path';

const commandLineArgs = process.argv.slice(2);
const isWatchMode = commandLineArgs.includes('--watch');

// Note: we wanted at first to use `sass` with its JavaScript API
// but this one does not bring `watch` in the API (only in the CLI), and using
// a basic watcher does not watch for imported files (except if doing complex analysis)...
// so just using parallel commands instead of dealing with complex things
async function generateStyleFiles() {
  const styleToGeneratePattern = path.resolve(__dirname, 'src/**/index.scss');
  const outputFolderPath = path.resolve(__dirname, `./dist`);
  const sourceFolderPath = path.resolve(__dirname, `./src`);

  const stylePaths = await glob(styleToGeneratePattern);

  const sourceDestinationMap: string[] = stylePaths.map((stylePath) => {
    const destination = `${path.join(outputFolderPath, path.relative(sourceFolderPath, stylePath)).replace(/\.[^/.]+$/, '')}.css`;
    const destinationFolder = path.dirname(destination);

    fs.ensureDirSync(destinationFolder);

    return `${stylePath}:${destination}`;
  });

  const command: string = `pnpm sass ${
    isWatchMode ? '--watch' : ''
  } --update --style=compressed --load-path=./node_modules --load-path=./node_modules/@gouvfr/dsfr ${sourceDestinationMap.join(' ')}`;

  await concurrently([{ command: command }]).result;
}

generateStyleFiles();
