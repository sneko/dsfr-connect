import chalk, { Chalk } from 'chalk';

import { build as bootstrapV5Build, downloadAndExtract as bootstrapV5DownloadAndExtract } from '@dsfrc/docs/scripts/bootstrap-v5/actions';
import { build as infirmaV1Build, downloadAndExtract as infirmaV1DownloadAndExtract } from '@dsfrc/docs/scripts/infima-v1/actions';
import { build as muiV5Build, downloadAndExtract as muiV5DownloadAndExtract } from '@dsfrc/docs/scripts/mui-v5/actions';
import { build as mainBuild, downloadAndExtract as mainDownloadAndExtract } from '@dsfrc/docs/scripts/raw/actions';
import { build as vuetifyV3Build, downloadAndExtract as vuetifyV3DownloadAndExtract } from '@dsfrc/docs/scripts/vuetify-v3/actions';

export type TargetName = 'main' | 'bootstrap-v5' | 'vuetify-v3' | 'mui-v5' | 'infima-v1';

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
  {
    name: 'vuetify-v3',
    port: 6008,
    download: vuetifyV3DownloadAndExtract,
    extract: vuetifyV3Build,
    terminalFormatter: chalk.yellow,
  },
  {
    name: 'mui-v5',
    port: 6009,
    download: muiV5DownloadAndExtract,
    extract: muiV5Build,
    terminalFormatter: chalk.magenta,
  },
  {
    name: 'infima-v1',
    port: 6010,
    download: infirmaV1DownloadAndExtract,
    extract: infirmaV1Build,
    terminalFormatter: chalk.red,
  },
];
