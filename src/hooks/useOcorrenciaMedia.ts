import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Alert } from "react-native";

export const useOcorrenciaMedia = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // logica geolocalizacao
  const getLocation = async () => {
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Precisamos da localização para registrar a ocorrência."
        );
        setLoading(false);
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);
      return currentLocation;
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter a localização.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // logica camera
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Precisamos da câmera para registrar a foto."
        );
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.7, // 70% da qualidade para não pesar no upload
        allowsEditing: false,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
        return result.assets[0].uri;
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir a câmera.");
      console.error(error);
    }
  };

  return {
    location,
    photoUri,
    loading,
    getLocation,
    takePhoto,
    setPhotoUri,
  };
};
