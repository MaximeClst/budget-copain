import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { textStyle } from './styles';

type ITextProps = RNTextProps &
  VariantProps<typeof textStyle> & { className?: string };

const Text = React.forwardRef<React.ComponentRef<typeof RNText>, ITextProps>(
  function Text({ className, size, weight, ...props }, ref) {
    return (
      <RNText
        ref={ref}
        className={textStyle({ size, weight, class: className })}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';
export { Text };

