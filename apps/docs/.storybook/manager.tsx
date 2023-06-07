import { IconButton, Icons } from '@storybook/components';
import { addons, types } from '@storybook/manager-api';
import { Crisp } from 'crisp-sdk-web';
import React from 'react';
import { useEffectOnce } from 'usehooks-ts';

// Relative since statically analyzed
import { config } from '../../../apps/docs/utils/storybook/manager';

addons.setConfig(config);

// ------

const supportAddonId = 'supportAddonId';
const crispWebsiteId: string = process.env.CRISP_WEBSITE_ID || 'no_crisp_settings';

addons.register(supportAddonId, () => {
  addons.add(supportAddonId, {
    title: 'Support',
    type: types.TOOLEXTRA,
    render: (options) => {
      useEffectOnce(() => {
        let sessionIdToResume: string | null = null;
        if (window) {
          const searchParams = new URLSearchParams(window.location.search);
          sessionIdToResume = searchParams.get('crisp_sid');
        }

        Crisp.configure(crispWebsiteId, {
          autoload: !!sessionIdToResume, // If the user comes from a Crisp email to reply to the session, we load Crisp and this one should handle retrieving previous session
          cookieExpire: 7 * 24 * 60 * 60, // Must be in seconds, currently 7 days instead of the default 6 months
          sessionMerge: true,
          locale: 'fr',
        });

        if (sessionIdToResume) {
          Crisp.chat.open();
        }

        return () => {
          // Crisp should allow us to destroy the instance
          // Ref: https://stackoverflow.com/questions/71967230/how-to-destroy-crisp-chat
        };
      });

      return (
        <>
          <IconButton
            active={true} // Set active to distinguish it visually
            title="Nous contacter"
            onClick={() => {
              Crisp.chat.open();
            }}
          >
            {/* icon list: https://storybook-design-system.netlify.app/ */}
            <Icons icon="comments" />
            <span style={{ marginLeft: 8 }}>Support</span>
          </IconButton>
        </>
      );
    },
  });
});
