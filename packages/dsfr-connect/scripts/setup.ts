import AdmZip from 'adm-zip';
import fs from 'fs-extra';
import fetch from 'node-fetch-native';
import path from 'path';

import { mastodonVersion } from 'dsfr-connect/src/mastodon-v4/settings';

export async function downloadFile(url: string, destination: string): Promise<void> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
  }

  const content = await response.arrayBuffer();
  await fs.outputFile(destination, new Uint8Array(content));
}

async function prepareMastodonV4() {
  const zipUrl = `https://github.com/mastodon/mastodon/archive/refs/tags/${mastodonVersion}.zip`;
  const zipDestination = path.resolve(__dirname, '../src/mastodon-v4/mastodon-repository.zip');
  const extractionFolderPath = path.resolve(__dirname, '../src/mastodon-v4/mastodon');

  if (!(await fs.pathExists(zipDestination))) {
    await downloadFile(zipUrl, zipDestination);
  }

  const zip = new AdmZip(zipDestination);

  for (const entry of zip.getEntries()) {
    // Only extract the part we need to work with
    if (entry.isDirectory && entry.entryName.includes('/app/javascript/styles/mastodon/')) {
      zip.extractEntryTo(entry.entryName, extractionFolderPath, false, true);

      break;
    }
  }
}

async function main() {
  await prepareMastodonV4();
}

main();
