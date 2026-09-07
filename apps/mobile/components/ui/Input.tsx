import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 font-medium mb-1 text-sm">{label}</Text>
      )}
      <TextInput
        className={`border rounded-lg px-4 py-3 text-gray-900 bg-white text-base ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className ?? ''}`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}
    </View>
  );
}
