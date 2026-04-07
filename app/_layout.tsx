import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { UserProfileProvider } from '@/context/user-profile-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <UserProfileProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="create-account" />
          <Stack.Screen name="vehicle-setup" />
          <Stack.Screen name="maintenance-baseline" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="trips" />
          <Stack.Screen name="trip-details/[id]" />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </UserProfileProvider>
  );
}
