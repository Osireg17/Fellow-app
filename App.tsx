import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import RootNavigator from './navigations/Navigator';
import {SafeAreaProvider} from 'react-native-safe-area-context'
import { NativeBaseProvider, Box } from "native-base";
import { ThemeProvider } from 'react-native-elements';
import 'react-native-gesture-handler';

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <RootNavigator/>
        <StatusBar/>
      </SafeAreaProvider> 
    </ThemeProvider>
  );
}

