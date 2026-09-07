import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 py-12">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center mb-8"
          >
            <Ionicons name="arrow-back" size={24} color="#0D51B2" />
            <Text className="text-primary ml-2 font-medium">Back</Text>
          </TouchableOpacity>
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900">Forgot Password</Text>
            <Text className="text-gray-500 mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </Text>
          </View>
          <ForgotPasswordForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
