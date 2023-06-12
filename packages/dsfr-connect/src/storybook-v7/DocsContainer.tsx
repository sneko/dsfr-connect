// import { DocsContainer as BaseContainer, Unstyled } from '@storybook/blocks';
import { DocsContainer as BaseContainerAny, Unstyled as UnstyledAny } from '@storybook/blocks';
import React from 'react';

// [WORKAROUND] Getting:
// - '<BaseContainer' cannot be used as a JSX component. Its return type 'ReactElement<any, any> | null' is not a valid JSX element
// - 'Unstyled' cannot be used as a JSX component. Its return type 'ReactElement<any, any> | null' is not a valid JSX element
//
// Impossible for know to find the cause (dealing with `tsconfig` and deps...) so casting
const BaseContainer = BaseContainerAny as any;
const Unstyled = UnstyledAny as any;

// By default Storybook style is spread over the entire documentation (.mdx...)
// So we have to explicitly disable it with a wrapper
// (note it's not perfect, some links still get styled unfortunately)

export const DocsContainer: typeof BaseContainer = ({ children, context }: any) => {
  return (
    <>
      <BaseContainer context={context}>
        <Unstyled>{children}</Unstyled>
      </BaseContainer>
    </>
  );
};
