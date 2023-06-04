import chalk, { Chalk } from 'chalk';

import { build as bootstrapV5Build, downloadAndExtract as bootstrapV5DownloadAndExtract } from '@dsfrc/docs/scripts/bootstrap-v5/actions';
import { build as mainBuild, downloadAndExtract as mainDownloadAndExtract } from '@dsfrc/docs/scripts/raw/actions';

export type TargetName = 'main' | 'bootstrap-v5';

export interface Target {
  name: TargetName;
  port: number;
  download: () => Promise<void>;
  extract: () => Promise<void>;
  terminalFormatter: Chalk;
}

export const mainTarget: Target = {
  name: 'main',
  port: 6006,
  download: mainDownloadAndExtract,
  extract: mainBuild,
  terminalFormatter: chalk.blue,
};

export const frameworks: Target[] = [
  {
    name: 'bootstrap-v5',
    port: 6007,
    download: bootstrapV5DownloadAndExtract,
    extract: bootstrapV5Build,
    terminalFormatter: chalk.green,
  },
  // {
  //   name: 'vuetify-v3',
  //   port: 6008,
  // },
];
