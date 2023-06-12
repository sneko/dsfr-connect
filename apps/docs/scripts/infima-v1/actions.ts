import AdmZip from 'adm-zip';
import fs from 'fs-extra';
import { glob } from 'glob';
import handlebars from 'handlebars';
import path from 'path';

import { getFrameworkFolderPath } from '@dsfrc/docs/utils';
import { downloadFile } from '@dsfrc/docs/utils';

const framework: string = path.basename(__dirname);
const zipUrl = 'https://github.com/facebookincubator/infima/archive/refs/tags/v0.2.0-alpha.43.zip';

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
  const entries = await glob([path.resolve(__dirname, `../../tmp/${framework}/infima-0.2.0-alpha.43/website/docs`) + '/**/*.mdx']);
  const folderToStripPath = path.resolve(__dirname, `../../tmp/${framework}/infima-0.2.0-alpha.43/website/docs`);
  const storyTemplateFilePath = path.resolve(__dirname, `./template.stories.ts`);
  const htmlTemplateFilePath = path.resolve(__dirname, `./template.hbs`);
  const outputFolderPath = path.resolve(getFrameworkFolderPath(path.resolve(__dirname, `../../`), framework), 'stories/framework/');

  try {
    const storyTemplateContent = await fs.readFile(storyTemplateFilePath, 'utf-8');
    const storyTemplate = handlebars.compile(storyTemplateContent);
    const htmlTemplateContent = await fs.readFile(htmlTemplateFilePath, 'utf-8');
    const htmlTemplate = handlebars.compile(htmlTemplateContent);

    await Promise.all(
      entries.map(async (entry) => {
        // Subtract the root and remove the extension
        let storyName = path.relative(folderToStripPath, entry).replace(/\.[^/.]+$/, '');

        let content = await fs.readFile(entry, 'utf-8');

        // Get all code sections
        const regex = /```html([\s\S]*?)```/g;
        const matches = content.matchAll(regex);
        const codes = Array.from(matches).map((m) => {
          return m[1].trim();
        });

        if (!codes.length) {
          return;
        }

        // Format the story
        const storyContent = storyTemplate({
          component: storyName,
        });
        const pageHtml = htmlTemplate({
          codes: codes,
        });

        await fs.outputFile(path.join(outputFolderPath, storyName, 'index.html'), pageHtml);
        await fs.outputFile(path.join(outputFolderPath, storyName, 'index.stories.ts'), storyContent);
      })
    );

    console.log('successful operation');
  } catch (error) {
    console.error('an error has occured:', error);

    throw error;
  }
}
