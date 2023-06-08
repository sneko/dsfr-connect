import path from 'path';
import { defineConfig } from 'tsup';

// Since `generate-json-files.ts` relies on dependencies in different format
// we have to compile it with shims (like Babel...) to be able to execute it
const entryPattern = path.resolve(__dirname, 'generate-json-files.ts');
const jsonToGeneratePattern = path.resolve(__dirname, 'src/**/*.json.ts');

export default defineConfig((options) => {
  return {
    entry: [entryPattern, jsonToGeneratePattern],
    outDir: 'builder-dist',
    format: ['cjs'],
    minify: false,
    splitting: true,
    split: [],
    clean: true,
    async onSuccess() {},
  };
});
