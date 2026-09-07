import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, Alert } from 'react-native';
import { toast } from 'sonner-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useUpdateExperience, useDeleteExperience } from '../../hooks/useProfile';
import type { Experience } from '../../types';

interface ExperienceCardProps {
  experience: Experience;
  isOwnProfile: boolean;
}

const expSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  title: z.string().min(1, 'Title is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

type ExpFormData = z.infer<typeof expSchema>;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function ExperienceCard({ experience, isOwnProfile }: ExperienceCardProps) {
  const [editVisible, setEditVisible] = useState(false);
  const updateExp = useUpdateExperience();
  const deleteExp = useDeleteExperience();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpFormData>({
    resolver: zodResolver(expSchema),
    defaultValues: {
      company: experience.company,
      title: experience.title,
      startDate: experience.startDate.slice(0, 10),
      endDate: experience.endDate?.slice(0, 10) ?? '',
      description: experience.description ?? '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: ExpFormData) => {
    try {
      await updateExp.mutateAsync({
        id: experience.id,
        data: {
          ...data,
          startDate: new Date(data.startDate).toISOString(),
          endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
          description: data.description || undefined,
        },
      });
      toast.success('Experience updated.');
      setEditVisible(false);
    } catch {
      toast.error('Failed to update experience.');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Experience', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteExp.mutate(experience.id),
      },
    ]);
  };

  return (
    <View className="bg-white rounded-xl border border-gray-100 p-4 mb-3">
      <Text className="text-gray-900 font-semibold text-base">{experience.title}</Text>
      <Text className="text-primary font-medium text-sm mt-0.5">{experience.company}</Text>
      <Text className="text-gray-400 text-xs mt-1">
        {formatDate(experience.startDate)} —{' '}
        {experience.endDate ? formatDate(experience.endDate) : 'Present'}
      </Text>
      {experience.description && (
        <Text className="text-gray-600 text-sm mt-2 leading-5">{experience.description}</Text>
      )}
      {isOwnProfile && (
        <View className="flex-row gap-2 mt-3">
          <Button
            title="Edit"
            variant="outline"
            onPress={() => setEditVisible(true)}
            className="flex-1 py-2"
          />
          <Button
            title="Delete"
            variant="danger"
            onPress={handleDelete}
            loading={deleteExp.isPending}
            className="flex-1 py-2"
          />
        </View>
      )}

      <Modal visible={editVisible} animationType="slide" presentationStyle="pageSheet">
        <ScrollView className="flex-1 bg-white">
          <View className="p-6">
            <Text className="text-xl font-bold text-gray-900 mb-6">Edit Experience</Text>
            <Controller
              control={control}
              name="company"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Company"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.company?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Job Title"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.title?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="startDate"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Start Date (YYYY-MM-DD)"
                  placeholder="2022-01-01"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.startDate?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="endDate"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="End Date (YYYY-MM-DD, leave blank if current)"
                  placeholder="2023-12-31"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.endDate?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Description"
                  multiline
                  numberOfLines={3}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.description?.message}
                />
              )}
            />
            <Button
              title="Save"
              onPress={handleSubmit(onSubmit)}
              loading={updateExp.isPending}
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
