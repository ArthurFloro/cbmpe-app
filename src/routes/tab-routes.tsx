import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ocorrencias from '../screens/Ocorrencias';
import Map from '../screens/Map';
import { Home } from '../screens/Home';

const Tab = createBottomTabNavigator()

export function TabRoutes() {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
        headerShown: false, // Remove o header padrão das abas
        tabBarActiveTintColor: '#0066CC',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'add-circle-sharp' : 'add-circle-outline';
          } else if (route.name === 'Ocorrencias') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}>


            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Ocorrencias" component={Ocorrencias} />
            <Tab.Screen name="Map" component={Map} />


        </Tab.Navigator>
    )   
}