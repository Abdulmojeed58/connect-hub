import React, { useState } from 'react';
import { View, Text, Modal, ScrollView } from 'react-native';
import { toast } from 'sonner-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useUpdateProfile } from '../../hooks/useProfile';
import type { Profile } from '../../types';

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
}

const editSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  photoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type EditFormData = z.infer<typeof editSchema>;

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const [editVisible, setEditVisible] = useState(false);
  const updateProfile = useUpdateProfile();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      fullName: profile.fullName,
      headline: profile.headline ?? '',
      bio: profile.bio ?? '',
      location: profile.location ?? '',
      photoUrl: profile.photoUrl ?? '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: EditFormData) => {
    try {
      await updateProfile.mutateAsync({
        fullName: data.fullName,
        headline: data.headline || undefined,
        bio: data.bio || undefined,
        location: data.location || undefined,
        photoUrl: data.photoUrl || undefined,
      });
      toast.success('Profile updated successfully.');
      setEditVisible(false);
    } catch {
      toast.error('Failed to update profile.');
    }
  };

  return (
    <View className="bg-white p-6 border-b border-gray-100">
      <View className="items-center mb-4">
        <Avatar name={profile.fullName} photoUrl={profile.photoUrl} size="xl" />
        <Text className="text-gray-900 text-xl font-bold mt-3">{profile.fullName}</Text>
        {profile.headline && (
          <Text className="text-gray-500 text-base mt-1 text-center">{profile.headline}</Text>
        )}
        {profile.location && (
          <Text className="text-gray-400 text-sm mt-1">{profile.location}</Text>
        )}
        {profile.bio && (
          <Text className="text-gray-600 text-sm mt-3 text-center leading-5">{profile.bio}</Text>
        )}
      </View>

      {isOwnProfile && (
        <Button
          title="Edit Profile"
          variant="outline"
          onPress={() => setEditVisible(true)}
        />
      )}

      <Modal visible={editVisible} animationType="slide" presentationStyle="pageSheet">
        <ScrollView className="flex-1 bg-white">
          <View className="p-6">
            <Text className="text-xl font-bold text-gray-900 mb-6">Edit Profile</Text>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.fullName?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="headline"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Headline"
                  placeholder="e.g. Software Engineer at Company"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.headline?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Bio"
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={4}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.bio?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Location"
                  placeholder="e.g. San Francisco, CA"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.location?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="photoUrl"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Photo URL"
                  placeholder="https://..."
                  keyboardType="url"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.photoUrl?.message}
                />
              )}
            />
            <Button
              title="Save Changes"
              onPress={handleSubmit(onSubmit)}
              loading={updateProfile.isPending}
              className="mt-2"
            />
            <Button
              title="Cancel"
              variant="secondary"
              onPress={() => setEditVisible(false)}
              className="mt-3"
            />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}
