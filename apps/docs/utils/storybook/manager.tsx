import { IconButton, Icons } from '@storybook/components';
import { addons, types } from '@storybook/manager-api';
import { Addon_Config } from '@storybook/types';
import React from 'react';

import { mainTargetPort } from '../../../../apps/docs/utils/static-workdaround';

export const config: Addon_Config = {
  sidebar: {
    showRoots: true,
    collapsedRoots: ['gallery'],
  },
};

export function registerGoToMainInstanceAddon() {
  const goToMainInterfaceAddonId = 'goToMainInterfaceAddonId';

  addons.register(goToMainInterfaceAddonId, () => {
    addons.add(goToMainInterfaceAddonId, {
      title: 'Support',
      type: types.TOOLEXTRA,
      render: (options) => {
        return (
          <>
            <IconButton
              active={true} // Set active to distinguish it visually
              onClick={() => {
                if (window.document.location.pathname.startsWith('/frameworks/')) {
                  // It has been deployed under the same root
                  window.location.href = '/main/';
                } else if (window.document.location.hostname === 'localhost') {
                  window.location.href = `http://localhost:${mainTargetPort}/`;
                }
              }}
            >
              {/* icon list: https://storybook-design-system.netlify.app/ */}
              <Icons icon="home" />
              <span style={{ marginLeft: 8 }}>Retourner à la vue principale</span>
            </IconButton>
          </>
        );
      },
    });
  });
}
