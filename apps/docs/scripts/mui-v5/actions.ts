import AdmZip from 'adm-zip';
import fs from 'fs-extra';
import { glob } from 'glob';
import handlebars from 'handlebars';
import path from 'path';

import { assetsUrls } from '@dsfrc/docs/scripts/assets';
import { getFrameworkFolderPath } from '@dsfrc/docs/utils';
import { downloadFile } from '@dsfrc/docs/utils';

const framework: string = path.basename(__dirname);
const zipUrl = assetsUrls.muiV5;

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
  const entries = await glob(path.resolve(__dirname, `../../tmp/${framework}/material-ui-5.13.4/docs/data/material/components`) + '/**/*.tsx');
  const folderToStripPath = path.resolve(__dirname, `../../tmp/${framework}/material-ui-5.13.4/docs/data/material/components`);
  const storyTemplateFilePath = path.resolve(getFrameworkFolderPath(path.resolve(__dirname, `../../`), framework), 'scripts/template.stories.ts');
  const outputFolderPath = path.resolve(getFrameworkFolderPath(path.resolve(__dirname, `../../`), framework), 'stories/framework/');

  try {
    const storyTemplateContent = await fs.readFile(storyTemplateFilePath, 'utf-8');
    const storyTemplate = handlebars.compile(storyTemplateContent);

    await Promise.all(
      entries.map(async (entry) => {
        // Subtract the root and remove the extension
        const storyName = path.relative(folderToStripPath, entry).replace(/\.[^/.]+$/, '');

        // Skip because those components have a logic not easy to mimic or to disable
        if (
          [
            // Those below use a custom module component that adds complexity to integrate
            'grid/InteractiveGrid',
            'grid/SpacingGrid',
            'grid2/SpacingGrid',
            'stack/InteractiveStack',
          ].includes(storyName)
        ) {
          return;
        }

        let content = await fs.readFile(entry, 'utf-8');

        // Format the story
        const storyContent = storyTemplate({
          framework: framework,
          component: storyName,
        });

        await fs.outputFile(path.join(outputFolderPath, storyName, 'Index.tsx'), content);
        await fs.outputFile(path.join(outputFolderPath, storyName, 'index.stories.ts'), storyContent);
      })
    );

    console.log('successful operation');
  } catch (error) {
    console.error('an error has occured:', error);

    throw error;
  }
}
