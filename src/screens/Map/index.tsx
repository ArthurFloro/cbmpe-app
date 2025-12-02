import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet, Text } from 'react-native';
import { useLocation } from '../../contexts/LocantionProvider'; // <--- Importe o hook

export default function Map() {
  const { userLocation } = useLocation();

  if (!userLocation) {
    return (
      <View style={styles.container}>
        <Text>Aguardando localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        region={userLocation} // O mapa foca onde o usuário está
        showsUserLocation={true} // Mostra a bolinha azul do GPS nativo
      >
        {/* Opcional: Adicionar um pino fixo na coordenada capturada */}
        <Marker 
          coordinate={userLocation}
          title="Minha Localização"
          description="Local capturado no formulário"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});