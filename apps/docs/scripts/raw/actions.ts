import axios, { AxiosError } from 'axios';
import fs from 'fs-extra';
import { glob } from 'glob';
import handlebars from 'handlebars';
import he from 'he';
import { JSDOM } from 'jsdom';
import path from 'path';
import urlToolkit from 'url-toolkit';

const framework: string = path.basename(__dirname);

const mainPageUrl = new URL('https://main--ds-gouv.netlify.app/example/');
const baseUrl = mainPageUrl.toString();
const outputFolder = path.resolve(__dirname, `../../tmp/${framework}`);
const visitedUrls = new Set();

export async function downloadAndExtract() {
  // We do our own crawling because there is no good library to do recursive lookup simply
  await startCrawling();
}

export async function build() {
  const entries = await glob(path.resolve(__dirname, `../../tmp/${framework}`) + '/**/*.html');
  const folderToStripPath = path.resolve(__dirname, `../../tmp/${framework}/example`);
  const storyTemplateFilePath = path.resolve(__dirname, `./template.stories.ts`);
  const htmlTemplateFilePath = path.resolve(__dirname, `./template.hbs`);
  const outputFolderPath = path.resolve(__dirname, '../../stories/framework/');

  try {
    const storyTemplateContent = await fs.readFile(storyTemplateFilePath, 'utf-8');
    const storyTemplate = handlebars.compile(storyTemplateContent);
    const htmlTemplateContent = await fs.readFile(htmlTemplateFilePath, 'utf-8');
    const htmlTemplate = handlebars.compile(htmlTemplateContent);

    await Promise.all(
      entries.map(async (entry) => {
        // Subtract the root and remove the extension
        const storyName = path.relative(folderToStripPath, entry).replace(/\.[^/.]+$/, '');

        let pageHtml = await fs.readFile(entry, 'utf-8');

        // Get all code sections
        const dom = new JSDOM(pageHtml);
        const codes = dom.window.document.querySelectorAll('code');
        if (!codes.length) {
          return;
        }

        // Format the story
        const storyContent = storyTemplate({
          component: storyName,
        });
        const componentHtml = htmlTemplate({
          codes: Array.from(codes.values()).map((code) => {
            // Since in `code` tags all entities were obviously encoded
            return he.decode(code.innerHTML).trim();
          }),
        });

        await fs.outputFile(path.join(outputFolderPath, storyName, 'index.html'), componentHtml);
        await fs.outputFile(path.join(outputFolderPath, storyName, 'index.stories.ts'), storyContent);
      })
    );

    console.log('successful operation');
  } catch (error) {
    console.error('an error has occured:', error);

    throw error;
  }
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      // Ignore
    } else {
      throw error;
    }
  }

  return null;
}

async function savePage(url: string, content: string) {
  const urlObject = new URL(url);

  // Remove last "/" if any and encode name
  const filePath = path.join(outputFolder, `${urlObject.pathname.replace(/\/$/, '')}.html`);
  await fs.outputFile(filePath, content);
}

async function crawlPage(url: string) {
  if (visitedUrls.has(url)) {
    return;
  }

  visitedUrls.add(url);

  try {
    const html = await fetchPage(url);
    if (!html) {
      return;
    }

    await savePage(url, html);

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const links = document.querySelectorAll('a');
    for (const link of links) {
      const href = link.getAttribute('href');

      if (href) {
        let absoluteUrl = urlToolkit.buildAbsoluteURL(url, href);

        // Prevent crawling same page due to different anchors
        const urlObject = new URL(absoluteUrl);
        urlObject.hash = '';

        absoluteUrl = urlObject.toString();

        // If not a subpage of the main one, ignore to save requests
        if (!absoluteUrl.startsWith(mainPageUrl.toString())) {
          continue;
        }

        crawlPage(absoluteUrl);
      }
    }
  } catch (error) {
    console.error(`Error has occured while crawling ${url}:`, error);
    throw error;
  }
}

async function startCrawling() {
  await crawlPage(baseUrl);
}
