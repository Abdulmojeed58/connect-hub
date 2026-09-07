import React from 'react';
import { View, Text, Image } from 'react-native';

interface AvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-10 h-10', text: 'text-sm' },
  lg: { container: 'w-16 h-16', text: 'text-xl' },
  xl: { container: 'w-24 h-24', text: 'text-3xl' },
};

const sizePixels = {
  sm: 32,
  md: 40,
  lg: 64,
  xl: 96,
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export function Avatar({ name, photoUrl, size = 'md' }: AvatarProps) {
  const styles = sizeMap[size];
  const px = sizePixels[size];

  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        className={`${styles.container} rounded-full`}
        style={{ width: px, height: px, borderRadius: px / 2 }}
      />
    );
  }

  return (
    <View
      className={`${styles.container} rounded-full bg-primary items-center justify-center`}
      style={{ width: px, height: px, borderRadius: px / 2 }}
    >
      <Text className={`${styles.text} text-white font-bold`}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
