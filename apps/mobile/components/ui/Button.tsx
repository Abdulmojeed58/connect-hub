import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger';
type Size = 'sm' | 'md';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantStyles: Record<Variant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary rounded-xl items-center justify-center',
    text: 'text-white font-semibold',
  },
  secondary: {
    container: 'bg-gray-100 rounded-xl items-center justify-center',
    text: 'text-gray-700 font-semibold',
  },
  outline: {
    container: 'border border-primary rounded-xl items-center justify-center bg-transparent',
    text: 'text-primary font-semibold',
  },
  danger: {
    container: 'bg-red-500 rounded-xl items-center justify-center',
    text: 'text-white font-semibold',
  },
};

const sizeStyles: Record<Size, { container: string; text: string }> = {
  sm: { container: 'py-2 px-4', text: 'text-sm' },
  md: { container: 'py-3.5 px-6', text: 'text-base' },
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`${v.container} ${s.container} ${isDisabled ? 'opacity-50' : ''} ${className ?? ''}`}
      disabled={isDisabled}
      activeOpacity={0.75}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'secondary' ? '#0D51B2' : '#ffffff'}
          size="small"
        />
      ) : (
        <Text className={`${v.text} ${s.text}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
