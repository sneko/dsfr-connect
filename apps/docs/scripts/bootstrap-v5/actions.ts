import AdmZip from 'adm-zip';
import fs from 'fs-extra';
import handlebars from 'handlebars';
import path from 'path';
import { downloadFile } from 'utils';

const framework = 'bootstrap-v5';
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
  const srcFolderPath = path.resolve(__dirname, `../../tmp/${framework}/bootstrap-5.3.0-alpha3/site/content/docs/5.3/examples`);
  const templateFilePath = path.resolve(__dirname, `./template.stories.ts`);
  const outputFolderPath = path.resolve(__dirname, `../../stories/frameworks/${framework}/`);

  try {
    const entries = (await fs.readdir(srcFolderPath, { withFileTypes: true })).filter((entry) => !!entry);

    const storyTemplateContent = await fs.readFile(templateFilePath, 'utf-8');
    const storyTemplate = handlebars.compile(storyTemplateContent);

    await Promise.all(
      entries.map(async (entry) => {
        // Components are in directory, use it as the name
        if (entry.isDirectory()) {
          const componentName = entry.name;

          const filePath = path.join(srcFolderPath, `${entry.name}/index.html`);
          let componentHtml = await fs.readFile(filePath, 'utf-8');

          // Remove meta content at the top that is visible when rendering the story and escape needed quotes for the template
          componentHtml = componentHtml
            .replace(/---[\s\S]*?---/, '')
            .replace(/\{\{[\s\S]*?\}\}/g, '') // Remove all templating pleceholders of the Bootstrap documentation
            .trim();

          // Format the story
          const storyContent = storyTemplate({
            framework: framework,
            component: componentName,
          });

          await fs.outputFile(path.join(outputFolderPath, componentName, 'index.html'), componentHtml);
          await fs.outputFile(path.join(outputFolderPath, componentName, 'index.stories.ts'), storyContent);
        }
      })
    );

    console.log('successful operation');
  } catch (error) {
    console.error('an error has occured:', error);

    throw error;
  }
}

export async function run() {
  await downloadAndExtract();
  await build();
}
