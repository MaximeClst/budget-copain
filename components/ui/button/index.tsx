import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { buttonStyle, buttonTextStyle } from './styles';
import { Text } from '../text';

type IButtonProps = PressableProps &
  VariantProps<typeof buttonStyle> & {
    className?: string;
    children?: React.ReactNode;
  };

const Button = React.forwardRef<React.ComponentRef<typeof Pressable>, IButtonProps>(
  function Button({ className, variant, size, disabled, children, ...props }, ref) {
    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        className={buttonStyle({ variant, size, disabled, class: className })}
        {...props}
      >
        {typeof children === 'string' ? (
          <Text className={buttonTextStyle({ variant, size })}>{children}</Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';
export { Button };

