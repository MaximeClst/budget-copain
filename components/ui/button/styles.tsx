import { tva } from "@gluestack-ui/utils/nativewind-utils";

export const buttonStyle = tva({
  base: "flex-row items-center justify-center rounded-lg px-4 py-3 gap-3",
  variants: {
    variant: {
      solid: "bg-primary-500",
      outline: "border border-primary-500 bg-transparent",
      ghost: "bg-transparent",
      link: "bg-transparent",
    },
    size: {
      sm: "px-3 py-2",
      md: "px-4 py-3",
      lg: "px-6 py-4",
    },
    disabled: {
      true: "opacity-50",
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});

export const buttonTextStyle = tva({
  base: "font-semibold text-center",
  variants: {
    variant: {
      solid: "text-white",
      outline: "text-primary-500",
      ghost: "text-primary-500",
      link: "text-primary-500 underline",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});
