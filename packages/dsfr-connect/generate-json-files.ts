import fs from 'fs-extra';
import { glob } from 'glob';
import path from 'path';

async function generateJsonFiles() {
  // Due to transpilation (like Babel) at the time we have a look at it they will be `*.json.js` and not `*.json.ts`
  const jsonToGeneratePattern = path.resolve(__dirname, 'src/**/*.json.js');
  const outputFolderPath = path.resolve(__dirname, `../dist`); // Since we are in `/builder-dist`
  const sourceFolderPath = path.resolve(__dirname, `./src`);

  // Generate static JSON for themes when it's possible
  // (it allows other languages to directly import it)
  const generatorsPaths = await glob(jsonToGeneratePattern);

  for (const generatorPath of generatorsPaths) {
    const generator = await import(generatorPath);

    // Beautify the output to ease the reading
    const jsonContent = JSON.stringify(generator.default, null, 2);

    const generatorPathWithoutTs = generatorPath.replace(/\.[^/.]+$/, ''); // Remove ".ts" extension
    const destination = path.join(outputFolderPath, path.relative(sourceFolderPath, generatorPathWithoutTs));

    await fs.outputFile(destination, jsonContent);
  }
}

generateJsonFiles();
