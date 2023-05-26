import { addons } from '@storybook/manager-api';

// Relative since statically analyzed
import { config } from '../../../apps/docs/utils/storybook/manager';

addons.setConfig(config);
