import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

// Importa as rotas de pilha (que já contém as tabs)
import { TabRoutes } from './tab-routes';

export default function Routes() {
  return (
    <NavigationContainer>
      <TabRoutes />
    </NavigationContainer>
  );
}