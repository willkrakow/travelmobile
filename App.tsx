import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { QueryClientProvider, QueryClient } from "react-query";
import { ThemeProvider } from "@rneui/themed";
import { theme } from "./utils/theme";
import React from "react";
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const colorScheme = useColorScheme();
  const client = new QueryClient();
  
  const [fontsLoaded] = Font.useFonts({
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Thin": require("./assets/fonts/Inter-Thin.ttf"),
    "Inter-Light": require("./assets/fonts/Inter-Light.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    "Inter-Black": require("./assets/fonts/Inter-Black.ttf"),
    "LobsterTwo-Bold": require("./assets/fonts/LobsterTwo-Bold.ttf"),
    "LobsterTwo-BoldItalic": require("./assets/fonts/LobsterTwo-BoldItalic.ttf"),
    "LobsterTwo-Italic": require("./assets/fonts/LobsterTwo-Italic.ttf"),
    "LobsterTwo-Regular": require("./assets/fonts/LobsterTwo-Regular.ttf"),
  });

    const onLayoutRootView = React.useCallback(async () => {
      if (fontsLoaded) {
        // This tells the splash screen to hide immediately! If we call this after
        // `setAppIsReady`, then we may see a blank screen while the app is
        // loading its initial state and rendering its first pixels. So instead,
        // we hide the splash screen once we know the root view has already
        // performed layout.
        await SplashScreen.hideAsync();
        console.log("here")
      }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
      return null;
    }

    return (
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={client}>  
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }
