import { addons } from '@storybook/manager-api';

// Relative since statically analyzed
import { config, registerGoToMainInstanceAddon } from '../../../apps/docs/utils/storybook/manager';

addons.setConfig(config);

registerGoToMainInstanceAddon();
