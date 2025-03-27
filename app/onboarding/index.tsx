import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function Onboarding() {
  console.log('Onboarding');
  return (
    <SafeAreaView style={styles.container}>
			<View style={styles.container}>
				<Text style={{ color: 'white' }}>Onboarding</Text>
			</View>
		</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
