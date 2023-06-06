import AdmZip from 'adm-zip';
import fs from 'fs-extra';
import { glob } from 'glob';
import handlebars from 'handlebars';
import path from 'path';

import { getFrameworkFolderPath } from '@dsfrc/docs/utils';
import { downloadFile } from '@dsfrc/docs/utils';

const framework: string = path.basename(__dirname);
const zipUrl = 'https://github.com/vuetifyjs/vuetify/archive/refs/tags/v3.3.1.zip';

export async function downloadAndExtract() {
  const zipDestination = path.resolve(__dirname, `../../tmp/${framework}.zip`);
  const extractionFolderPath = path.resolve(__dirname, `../../tmp/${framework}`);

  if (!(await fs.pathExists(zipDestination))) {
    await downloadFile(zipUrl, zipDestination);
  }

  const zip = new AdmZip(zipDestination);
  zip.extractAllTo(extractionFolderPath, true);
}

export async function build() {
  const entries = await glob(path.resolve(__dirname, `../../tmp/${framework}/vuetify-3.3.1/packages/docs/src/examples`) + '/**/*.vue');
  const folderToStripPath = path.resolve(__dirname, `../../tmp/${framework}/vuetify-3.3.1/packages/docs/src/examples`);
  const storyTemplateFilePath = path.resolve(getFrameworkFolderPath(path.resolve(__dirname, `../../`), framework), 'scripts/template.stories.ts');
  const outputFolderPath = path.resolve(getFrameworkFolderPath(path.resolve(__dirname, `../../`), framework), 'stories/framework/');

  try {
    // Copy the "util" folder that is needed by some components from their documentation (it's referenced by an alias)
    fs.copySync(path.resolve(__dirname, `../../tmp/${framework}/vuetify-3.3.1/packages/docs/src/util`), path.join(outputFolderPath, 'util'));

    const storyTemplateContent = await fs.readFile(storyTemplateFilePath, 'utf-8');
    const storyTemplate = handlebars.compile(storyTemplateContent);

    await Promise.all(
      entries.map(async (entry) => {
        // Subtract the root and remove the extension
        const storyName = path.relative(folderToStripPath, entry).replace(/\.[^/.]+$/, '');

        let content = await fs.readFile(entry, 'utf-8');

        // Format the story
        const storyContent = storyTemplate({
          framework: framework,
          component: storyName,
        });

        await fs.outputFile(path.join(outputFolderPath, storyName, 'index.vue'), content);
        await fs.outputFile(path.join(outputFolderPath, storyName, 'index.stories.ts'), storyContent);
      })
    );

    console.log('successful operation');
  } catch (error) {
    console.error('an error has occured:', error);

    throw error;
  }
}
