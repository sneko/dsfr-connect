import AdmZip from 'adm-zip';
import fs from 'fs-extra';
import { glob } from 'glob';
import handlebars from 'handlebars';
import path from 'path';

import { assetsUrls } from '@dsfrc/docs/scripts/assets';
import { getFrameworkFolderPath } from '@dsfrc/docs/utils';
import { downloadFile } from '@dsfrc/docs/utils';

const framework: string = path.basename(__dirname);
const zipUrl = assetsUrls.vuetifyV3;

export async function downloadAndExtract() {
  const zipDestination = path.resolve(__dirname, `../../tmp/${framework}.zip`);
  const extractionFolderPath = path.resolve(__dirname, `../../tmp/${framework}`);

  if (!(await fs.pathExists(zipDestination))) {
    await downloadFile(zipUrl, zipDestination);
  } else {
    console.warn(`${framework} assets downloads skipped since present locally`);
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

        // Skip because those components have a logic not easy to mimic or to disable
        if (
          [
            'v-ripple/misc-ripple-in-components', // Triggers the following issue: https://github.com/storybookjs/storybook/issues/22090#issuecomment-1582070420 and https://github.com/storybookjs/storybook/issues/22909
            'v-sheet/usage', // Use a custom store that adds complexity
          ].includes(storyName)
        ) {
          return;
        }

        let content = await fs.readFile(entry, 'utf-8');
        content = content.replace(/<codepen-(additional|resources[^>]*)>[\s\S]*?<\/codepen-(additional|resources)>/g, '').trim(); // Clean metadata content from their documentation

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
