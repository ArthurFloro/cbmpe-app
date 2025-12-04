import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OcorrenciaListScreen } from "./src/screens/OcorrenciaListScreen";
import { InitialScreen } from "./src/screens/InitialScreen";
import { StatusBar } from "react-native";
import { OcorrenciaFormScreen } from "./src/screens/OcoorenciaFormScreen";
const Stack = createStackNavigator();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#B22222",
    secondary: "#DAA520",
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="default" />
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="InitialScreen"
              component={InitialScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ListaOcorrencias"
              component={OcorrenciaListScreen}
              options={{ title: "Ocorrências CBMPE" }}
            />
            <Stack.Screen
              name="Formulario"
              component={OcorrenciaFormScreen}
              options={{ title: "Nova Ocorrência CBMPE" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
