import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/auth.store';
import { authApi } from '../../api/auth.api';
import { profileApi } from '../../api/profile.api';
import { useAddExperience, useAddEducation } from '../../hooks/useProfile';
import { ProfileHeader } from './ProfileHeader';
import { ExperienceCard } from './ExperienceCard';
import { EducationCard } from './EducationCard';
import { ChangePasswordModal } from './ChangePasswordModal';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner-native';

const expSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  title: z.string().min(1, 'Title is required'),
  startDate: z.string().min(1, 'Start date is required').refine(
    (v) => !isNaN(new Date(v).getTime()),
    'Enter a valid date (YYYY-MM-DD)',
  ),
  endDate: z.string().optional().refine(
    (v) => !v || !isNaN(new Date(v).getTime()),
    'Enter a valid date (YYYY-MM-DD)',
  ),
  description: z.string().optional(),
});
type ExpFormData = z.infer<typeof expSchema>;

function AddExperienceModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const addExp = useAddExperience();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ExpFormData>({
    resolver: zodResolver(expSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ExpFormData) => {
    try {
      await addExp.mutateAsync({
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        description: data.description || undefined,
      });
      toast.success('Experience added.');
      reset();
      onClose();
    } catch {
      toast.error('Failed to add experience.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ScrollView className="flex-1 bg-white">
        <View className="p-6">
          <Text className="text-xl font-bold text-gray-900 mb-6">Add Experience</Text>
          <Controller control={control} name="company" render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Company" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.company?.message} />
          )} />
          <Controller control={control} name="title" render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Job Title" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.title?.message} />
          )} />
          <Controller control={control} name="startDate" render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Start Date (YYYY-MM-DD)" placeholder="2022-01-01" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.startDate?.message} />
          )} />
          <Controller control={control} name="endDate" render={({ field: { onChange, onBlur, value } }) => (
            <Input label="End Date (leave blank if current)" placeholder="2023-12-31" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.endDate?.message} />
          )} />
          <Controller control={control} name="description" render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Description" multiline numberOfLines={3} onChangeText={onChange} onBlur={onBlur} value={value} error={errors.description?.message} />
          )} />
          <Button title="Add Experience" onPress={handleSubmit(onSubmit)} loading={addExp.isPending} />
          <Button title="Cancel" variant="secondary" onPress={() => { reset(); onClose(); }} className="mt-3" />
        </View>
      </ScrollView>
    </Modal>
  );
}

const eduSchema = z.object({
  school: z.string().min(1, 'School is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field is required'),
  year: z.string().refine((v) => /^\d{4}$/.test(v), 'Enter a valid year').transform(Number),
});
type EduFormData = z.infer<typeof eduSchema>;

function AddEducationModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const addEdu = useAddEducation();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<EduFormData>({
    resolver: zodResolver(eduSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: EduFormData) => {
    try {
      await addEdu.mutateAsync(data);
      toast.success('Education added.');
      reset();
      onClose();
    } catch {
      toast.error('Failed to add education.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ScrollView className="flex-1 bg-white">
        <View className="p-6">
          <Text className="text-xl font-bold text-gray-900 mb-6">Add Education</Text>
          <Controller control={control} name="school" render={({ field: { onChange, onBlur, value } }) => (
            <Input label="School" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.school?.message} />
          )} />
          <Controller control={control} name="degree" render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Degree" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.degree?.message} />
          )} />
          <Controller control={control} name="field" render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Field of Study" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.field?.message} />
          )} />
          <Controller control={control} name="year" render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Graduation Year" placeholder="2024" keyboardType="number-pad" onChangeText={onChange} onBlur={onBlur} value={String(value ?? '')} error={errors.year?.message} />
          )} />
          <Button title="Add Education" onPress={handleSubmit(onSubmit)} loading={addEdu.isPending} />
          <Button title="Cancel" variant="secondary" onPress={() => { reset(); onClose(); }} className="mt-3" />
        </View>
      </ScrollView>
    </Modal>
  );
}

export function OwnProfileView() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.userId) ?? '';
  const clearTokens = useAuthStore((s) => s.clearTokens);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [addExpVisible, setAddExpVisible] = useState(false);
  const [addEduVisible, setAddEduVisible] = useState(false);

  const { data: meData, isLoading: meLoading, isRefetching, refetch } = useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me(),
    staleTime: 1000 * 60 * 5,
  });

  const profileUserId = meData?.user?.id ?? userId;

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', profileUserId],
    queryFn: () => profileApi.getByUserId(profileUserId),
    enabled: !!profileUserId,
    staleTime: 1000 * 60 * 5,
  });

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            if (refreshToken) await authApi.logout(refreshToken);
          } catch { /* ignore */ }
          await clearTokens();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  if (meLoading || profileLoading) return <LoadingSpinner />;
  if (!profile) return null;

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#0D51B2" />
      }
    >
      <ProfileHeader profile={profile} isOwnProfile={true} />

      {/* Experience Section */}
      <View className="px-4 pt-6">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gray-900 text-lg font-bold">Experience</Text>
          <TouchableOpacity onPress={() => setAddExpVisible(true)}>
            <Ionicons name="add-circle-outline" size={24} color="#0D51B2" />
          </TouchableOpacity>
        </View>
        {profile.experiences.length === 0 ? (
          <Text className="text-gray-400 text-sm mb-4">No experience added yet.</Text>
        ) : (
          profile.experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} isOwnProfile={true} />
          ))
        )}
      </View>

      {/* Education Section */}
      <View className="px-4 pt-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gray-900 text-lg font-bold">Education</Text>
          <TouchableOpacity onPress={() => setAddEduVisible(true)}>
            <Ionicons name="add-circle-outline" size={24} color="#0D51B2" />
          </TouchableOpacity>
        </View>
        {profile.educations.length === 0 ? (
          <Text className="text-gray-400 text-sm mb-4">No education added yet.</Text>
        ) : (
          profile.educations.map((edu) => (
            <EducationCard key={edu.id} education={edu} isOwnProfile={true} />
          ))
        )}
      </View>

      {/* Actions */}
      <View className="px-4 pt-6 pb-10 gap-3">
        <Button title="Change Password" variant="outline" onPress={() => setChangePasswordVisible(true)} />
        <Button title="Logout" variant="danger" onPress={handleLogout} />
      </View>

      <ChangePasswordModal visible={changePasswordVisible} onClose={() => setChangePasswordVisible(false)} />
      <AddExperienceModal visible={addExpVisible} onClose={() => setAddExpVisible(false)} />
      <AddEducationModal visible={addEduVisible} onClose={() => setAddEduVisible(false)} />
    </ScrollView>
  );
}
