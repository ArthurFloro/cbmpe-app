import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, Card, ActivityIndicator } from 'react-native-paper';
import { useOcorrenciaMedia } from '../hooks/useOcorrenciaMedia';

// Importando MapView para visualizar (já que você instalou a lib)
import MapView, { Marker } from 'react-native-maps';

export default function TestScreen() {
  const { location, photoUri, loading, getLocation, takePhoto } = useOcorrenciaMedia();

  return (
    <View style={styles.container}>
      
      {/* Seção de GPS */}
      <Card style={styles.card}>
        <Card.Title title="Geolocalização" subtitle="Coordenadas GPS" />
        <Card.Content>
          {loading ? (
            <ActivityIndicator animating={true} />
          ) : location ? (
            <>
              <Text>Lat: {location.coords.latitude}</Text>
              <Text>Long: {location.coords.longitude}</Text>
              
              {/* Pequeno mapa para visualização */}
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  region={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                >
                  <Marker coordinate={location.coords} title="Ocorrência" />
                </MapView>
              </View>
            </>
          ) : (
            <Text>Nenhuma localização capturada.</Text>
          )}
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={getLocation} icon="map-marker">
            Pegar Localização
          </Button>
        </Card.Actions>
      </Card>

      {/* Seção de Câmera */}
      <Card style={styles.card}>
        <Card.Title title="Evidência Fotográfica" subtitle="Foto da ocorrência" />
        <Card.Content style={styles.centerContent}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
          ) : (
            <Text>Nenhuma foto capturada.</Text>
          )}
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={takePhoto} icon="camera">
            Tirar Foto
          </Button>
        </Card.Actions>
      </Card>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
  mapContainer: {
    height: 150,
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
});