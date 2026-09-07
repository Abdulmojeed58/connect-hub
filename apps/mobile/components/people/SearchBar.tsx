import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
  ...props
}: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-2 mb-3">
      <Ionicons name="search-outline" size={18} color="#9CA3AF" />
      <TextInput
        className="flex-1 ml-2 text-gray-900 text-base"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCapitalize="none"
        {...props}
      />
    </View>
  );
}
