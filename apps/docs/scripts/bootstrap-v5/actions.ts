import AdmZip from 'adm-zip';
import fs from 'fs-extra';
import { glob } from 'glob';
import handlebars from 'handlebars';
import path from 'path';

import { getFrameworkFolderPath } from '@dsfrc/docs/utils';
import { downloadFile } from '@dsfrc/docs/utils';

const framework: string = path.basename(__dirname);
const zipUrl = 'https://github.com/twbs/bootstrap/archive/refs/tags/v5.3.0-alpha3.zip';

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
  const entries = await glob([
    path.resolve(__dirname, `../../tmp/${framework}/bootstrap-5.3.0-alpha3/site/content/docs/5.3`) + '/**/*.md',
    path.resolve(__dirname, `../../tmp/${framework}/bootstrap-5.3.0-alpha3/site/content/docs/5.3/examples`) + '/**/*.html',
  ]);
  const folderToStripPath = path.resolve(__dirname, `../../tmp/${framework}/bootstrap-5.3.0-alpha3/site/content/docs/5.3`);
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
        const extension = path.extname(entry);
        let storyName = path.relative(folderToStripPath, entry).replace(/\.[^/.]+$/, '');

        let content = await fs.readFile(entry, 'utf-8');

        if (extension === '.html') {
          // They all end with `/meaningful/index.html`
          storyName = path.dirname(storyName);

          // Remove meta content at the top that is visible when rendering the story and escape needed quotes for the template
          const pageHtml = content
            .replace(/---[\s\S]*?---/, '')
            .replace(/\{\{[\s\S]*?\}\}/g, '') // Remove all templating pleceholders of the Bootstrap documentation
            .trim();

          // Format the story
          const storyContent = storyTemplate({
            component: storyName,
          });

          await fs.outputFile(path.join(outputFolderPath, storyName, 'index.html'), pageHtml);
          await fs.outputFile(path.join(outputFolderPath, storyName, 'index.stories.ts'), storyContent);
        } else {
          // Get all code sections
          // Note: the regex looks for code between specific tags, but skip those having another tags inside
          // because it's likely it's for the templating of Bootstrap (for loop...) and it's not worth it to have those specific cases
          const regex = /{{< example(?:[^>]*)? >}}((?:(?!{{<)[\s\S])*){{< \/example >}}/g;
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
        }
      })
    );

    console.log('successful operation');
  } catch (error) {
    console.error('an error has occured:', error);

    throw error;
  }
}
