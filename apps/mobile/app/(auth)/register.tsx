import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RegisterForm } from '../../components/auth/RegisterForm';

export default function RegisterScreen() {
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1 bg-gray-50"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Branded header */}
        <View className="bg-primary px-6 pt-16 pb-10 items-center">
          <View
            className="w-16 h-16 rounded-2xl bg-white items-center justify-center mb-4"
            style={{ shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }}
          >
            <Ionicons name="people" size={32} color="#0D51B2" />
          </View>
          <Text className="text-white text-3xl font-bold">ConnectHub</Text>
          <Text className="text-blue-200 text-sm mt-1">Build your professional network</Text>
        </View>

        {/* Form card */}
        <View
          className="mx-4 bg-white rounded-2xl p-6 -mt-5"
          style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 }}
        >
          <Text className="text-gray-900 text-xl font-bold mb-1">Create account</Text>
          <Text className="text-gray-500 text-sm mb-6">Join the professional network</Text>
          <RegisterForm />
          <View className="flex-row justify-center mt-5">
            <Text className="text-gray-500 text-sm">Already have an account? </Text>
            <Link href="/(auth)/login" className="text-primary font-semibold text-sm">
              Sign in
            </Link>
          </View>
        </View>
        <View className="h-8" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
