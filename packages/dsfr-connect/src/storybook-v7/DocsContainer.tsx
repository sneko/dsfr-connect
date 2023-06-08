import { DocsContainer as BaseContainer, Unstyled } from '@storybook/blocks';
import React from 'react';

// By default Storybook style is spread over the entire documentation (.mdx...)
// So we have to explicitly disable it with a wrapper
// (note it's not perfect, some links still get styled unfortunately)

export const DocsContainer: typeof BaseContainer = ({ children, context }) => {
  return (
    <BaseContainer context={context}>
      <Unstyled>{children}</Unstyled>
    </BaseContainer>
  );
};
