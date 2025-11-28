import React, { useState } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { inputStyle, inputFieldStyle } from './styles';
import { Text } from '../text';

type IInputProps = TextInputProps &
  VariantProps<typeof inputStyle> & {
    className?: string;
    label?: string;
    leftElement?: React.ReactNode;
    rightElement?: React.ReactNode;
  };

const Input = React.forwardRef<React.ComponentRef<typeof TextInput>, IInputProps>(
  function Input(
    {
      className,
      size,
      isDisabled,
      isInvalid,
      label,
      leftElement,
      rightElement,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <View>
        {label && (
          <Text className="mb-2 text-sm font-medium text-foreground-700">
            {label}
          </Text>
        )}
        <View
          className={inputStyle({
            size,
            isDisabled,
            isInvalid,
            isFocused,
            class: className,
          })}
        >
          {leftElement && <View className="mr-2">{leftElement}</View>}
          <TextInput
            ref={ref}
            editable={!isDisabled}
            className={inputFieldStyle({ size })}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor="#9CA3AF"
            {...props}
          />
          {rightElement && <View className="ml-2">{rightElement}</View>}
        </View>
      </View>
    );
  }
);

Input.displayName = 'Input';
export { Input };

