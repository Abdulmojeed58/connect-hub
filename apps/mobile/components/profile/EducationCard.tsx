import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, Alert } from 'react-native';
import { toast } from 'sonner-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useUpdateEducation, useDeleteEducation } from '../../hooks/useProfile';
import type { Education } from '../../types';

interface EducationCardProps {
  education: Education;
  isOwnProfile: boolean;
}

const eduSchema = z.object({
  school: z.string().min(1, 'School is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  year: z
    .string()
    .refine((v) => /^\d{4}$/.test(v), 'Enter a valid year (e.g. 2024)')
    .transform(Number),
});

type EduFormData = z.infer<typeof eduSchema>;

export function EducationCard({ education, isOwnProfile }: EducationCardProps) {
  const [editVisible, setEditVisible] = useState(false);
  const updateEdu = useUpdateEducation();
  const deleteEdu = useDeleteEducation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EduFormData>({
    resolver: zodResolver(eduSchema),
    defaultValues: {
      school: education.school,
      degree: education.degree,
      field: education.field,
      year: String(education.year) as unknown as number,
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: EduFormData) => {
    try {
      await updateEdu.mutateAsync({
        id: education.id,
        data: {
          school: data.school,
          degree: data.degree,
          field: data.field,
          year: data.year,
        },
      });
      toast.success('Education updated.');
      setEditVisible(false);
    } catch {
      toast.error('Failed to update education.');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Education', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteEdu.mutate(education.id),
      },
    ]);
  };

  return (
    <View className="bg-white rounded-xl border border-gray-100 p-4 mb-3">
      <Text className="text-gray-900 font-semibold text-base">{education.school}</Text>
      <Text className="text-gray-700 text-sm mt-0.5">
        {education.degree} in {education.field}
      </Text>
      <Text className="text-gray-400 text-xs mt-1">{education.year}</Text>
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
            loading={deleteEdu.isPending}
            className="flex-1 py-2"
          />
        </View>
      )}

      <Modal visible={editVisible} animationType="slide" presentationStyle="pageSheet">
        <ScrollView className="flex-1 bg-white">
          <View className="p-6">
            <Text className="text-xl font-bold text-gray-900 mb-6">Edit Education</Text>
            <Controller
              control={control}
              name="school"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="School"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.school?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="degree"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Degree"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.degree?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="field"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Field of Study"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.field?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="year"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Graduation Year"
                  placeholder="2024"
                  keyboardType="number-pad"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={String(value)}
                  error={errors.year?.message}
                />
              )}
            />
            <Button
              title="Save"
              onPress={handleSubmit(onSubmit)}
              loading={updateEdu.isPending}
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
