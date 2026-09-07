import React from 'react';
import { View, ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {
  color?: string;
  size?: 'small' | 'large';
}

export function LoadingSpinner({ color = '#0D51B2', size = 'large' }: LoadingSpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center py-8">
      <ActivityIndicator color={color} size={size} />
    </View>
  );
}
