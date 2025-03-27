import { Image, StyleSheet, Platform, Button, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useToast } from 'react-native-toaster-ui';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomeScreen() {
  // Component that uses the toast
  const ToastDemo = () => {
    const { toast } = useToast();

    const showToast = (variant: 'default' | 'success' | 'error' | 'warning' | 'info') => {
      toast({
        title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
        description: `This is a ${variant} toast notification.`,
        variant,
        duration: 3000,
        position: 'top',
      });
    };

    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, marginTop: 10 }}>
        <Button title="Default Toast" onPress={() => showToast('default')} />
        <Button title="Success Toast" onPress={() => showToast('success')} />
        <Button title="Error Toast" onPress={() => showToast('error')} />
        <Button title="Warning Toast" onPress={() => showToast('warning')} />
        <Button title="Info Toast" onPress={() => showToast('info')} />
      </View>
    );
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ToastDemo />
      <ThemedView style={styles.stepContainer}>
        <ThemeToggle />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12'
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
