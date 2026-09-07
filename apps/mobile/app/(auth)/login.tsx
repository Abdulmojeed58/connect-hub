import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LoginForm } from '../../components/auth/LoginForm';

export default function LoginScreen() {
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
          <Text className="text-gray-900 text-xl font-bold mb-1">Welcome back</Text>
          <Text className="text-gray-500 text-sm mb-6">Sign in to your account</Text>
          <LoginForm />
          <View className="flex-row justify-center mt-5">
            <Text className="text-gray-500 text-sm">Don't have an account? </Text>
            <Link href="/(auth)/register" className="text-primary font-semibold text-sm">
              Sign up
            </Link>
          </View>
          <View className="items-center mt-3">
            <Link href="/(auth)/forgot-password" className="text-gray-400 text-sm">
              Forgot password?
            </Link>
          </View>
        </View>
        <View className="h-8" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
