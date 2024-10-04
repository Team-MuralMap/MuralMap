import { UserProvider } from "@/contexts/UserContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="view-post" options={{ headerShown: false }} />
        <Stack.Screen name="publish-post" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
