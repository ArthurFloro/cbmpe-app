import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OcorrenciaFormScreen } from "./src/screens/OcoorenciaFormScreen";
import { OcorrenciaListScreen } from "./src/screens/OcorrenciaListScreen";

const Stack = createStackNavigator();

// Tema personalizado (Opcional - Cores do CBMPE)
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#B22222", // Vermelho Bombeiro
    secondary: "#DAA520", // Dourado/Caqui
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator>
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
