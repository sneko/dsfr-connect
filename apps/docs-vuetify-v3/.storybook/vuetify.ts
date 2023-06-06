import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import * as labsComponents from 'vuetify/labs/components';
import 'vuetify/styles';

import { getVuetifyOptions } from '@dsfrc/dsfr-connect/src/vuetify-v3';

export default createVuetify({
  components: { components, labsComponents },
  directives,
  ...getVuetifyOptions(),
});
