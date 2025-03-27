import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Redirect } from 'expo-router';
import { useStore } from '@/store/useStore';

export default function Onboarding() {
  const { login, isAuthenticated } = useStore();

  const handleConnectGmail = () => {
    // Simulate successful login
    login({
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com'
    });
    
    // Router is now used to navigate after login if needed
    // router.replace('/');
  };
  if (isAuthenticated) {
   return <Redirect href="/" />
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/gmail-logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Connect Your Gmail</Text>
          <Text style={styles.description}>
            Connect your Gmail account to access your emails and manage your inbox efficiently.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.connectButton}
          onPress={handleConnectGmail}
        >
          <Text style={styles.buttonText}>Connect Gmail</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#5f6368',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  connectButton: {
    backgroundColor: '#1a73e8',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 32,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
