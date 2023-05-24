import fs from 'fs-extra';
import fetch from 'node-fetch-native';
import path from 'path';

export async function downloadFile(url: string, destination: string): Promise<void> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
  }

  const content = await response.arrayBuffer();
  await fs.outputFile(destination, new Uint8Array(content));
}
