import path from 'path';
import { defineConfig } from 'tsup';

const entryPattern = path.resolve(__dirname, 'src/**/index.ts');
const jsonToGeneratePattern = path.resolve(__dirname, 'src/**/*.json.ts');

export default defineConfig((options) => {
  return {
    entry: [entryPattern, `!${jsonToGeneratePattern}`],
    outDir: 'dist',
    format: ['cjs', 'esm', 'iife'],
    globalName: 'DsfrConnect',
    minify: !options.watch,
    splitting: true,
    split: [],
    dts: true,
    sourcemap: true,
    shims: true,
    clean: true,
    async onSuccess() {},
  };
});
