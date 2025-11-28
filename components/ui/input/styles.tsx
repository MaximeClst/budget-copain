import { tva } from '@gluestack-ui/utils/nativewind-utils';

export const inputStyle = tva({
  base: 'flex-row items-center rounded-lg border border-outline-300 bg-background-0 px-4 py-3 text-foreground-900',
  variants: {
    size: {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    },
    isDisabled: {
      true: 'opacity-50',
    },
    isInvalid: {
      true: 'border-error-500',
    },
    isFocused: {
      true: 'border-primary-500',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const inputFieldStyle = tva({
  base: 'flex-1 text-foreground-900',
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

