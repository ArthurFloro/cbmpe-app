import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  TextInput,
  Button,
  SegmentedButtons,
  Text,
  Card,
  HelperText,
  useTheme,
} from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useOcorrenciaMedia } from "../hooks/useOcorrenciaMedia";
import { api } from "../services/api";

export function OcorrenciaFormScreen() {
  const navigation = useNavigation();
  const {
    location,
    photoUri,
    getLocation,
    takePhoto,
    loading: loadingMedia,
  } = useOcorrenciaMedia();

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [tipoFormulario, setTipoFormulario] = useState("PREVENCAO");

  // Estado único para todos os campos
  const [formData, setFormData] = useState({
    numeroAviso: "",
    nomeEvento: "",
    codigoCGO: "",
    dataChegada: "",
    dataInicio: "",
    dataSaida: "",
    publicoEstimado: "",
    publicoPresente: "",
    servicosRealizados: "",
    viaturasEmpregadas: "",
    responsavelGuarnicao: "",
    informacoesAdicionais: "",
    // Campos Específicos
    arAvcb: "", // Prevenção
    prevencaoAquatica: "", // Prevenção
    periodo: "", // Atividade Comunitária
    tipoInteracao: "", // Atividade Comunitária
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // 1. Validação Básica
    if (!location || !photoUri) {
      Alert.alert("Atenção", "Localização e Foto são obrigatórios!");
      return;
    }
    if (!formData.numeroAviso || !formData.nomeEvento) {
      Alert.alert(
        "Atenção",
        "Preencha os campos obrigatórios (Aviso, Evento)."
      );
      return;
    }

    setLoadingSubmit(true);

    try {
      // 2. Montando o FormData (Necessário para envio de arquivo)
      const data = new FormData();

      // Campos de Texto
      data.append("tipoFormulario", tipoFormulario);
      Object.keys(formData).forEach((key) => {
        // @ts-ignore
        data.append(key, formData[key]);
      });

      // Campos Aninhados (Backend espera publico[estimado])
      data.append("publico[estimado]", formData.publicoEstimado);
      data.append("publico[presente]", formData.publicoPresente);

      // Geolocalização
      data.append("latitude", String(location.coords.latitude));
      data.append("longitude", String(location.coords.longitude));

      // Foto (Sintaxe específica do React Native)
      const filename = photoUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : `image`;

      data.append("foto", {
        uri: photoUri,
        name: filename || "foto.jpg",
        type,
      } as any);

      // 3. Envio para API
      await api.post("/ocorrencias", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Sucesso", "Ocorrência registrada com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao enviar ocorrência. Verifique sua conexão.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Seletor de Tipo de Formulário */}
        <SegmentedButtons
          value={tipoFormulario}
          onValueChange={setTipoFormulario}
          buttons={[
            { value: "PREVENCAO", label: "Prevenção (Verde)" },
            { value: "ATIVIDADE_COMUNITARIA", label: "Comunitária (Caqui)" },
          ]}
          style={styles.segmentedButton}
        />

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={{ marginBottom: 10 }}>
              Dados Essenciais
            </Text>

            <TextInput
              label="Nº Aviso (CIODS)"
              mode="outlined"
              style={styles.input}
              value={formData.numeroAviso}
              onChangeText={(t) => handleChange("numeroAviso", t)}
            />

            <TextInput
              label="Nome do Evento"
              mode="outlined"
              style={styles.input}
              value={formData.nomeEvento}
              onChangeText={(t) => handleChange("nomeEvento", t)}
            />

            <TextInput
              label="CGO (Ex: 5.1.8)"
              mode="outlined"
              style={styles.input}
              value={formData.codigoCGO}
              onChangeText={(t) => handleChange("codigoCGO", t)}
            />
          </Card.Content>
        </Card>

        {/* Campos Dinâmicos baseados na seleção */}
        {tipoFormulario === "PREVENCAO" ? (
          <Card style={[styles.card, { borderColor: "green", borderWidth: 1 }]}>
            <Card.Title title="Dados de Prevenção" />
            <Card.Content>
              <TextInput
                label="AR / AVCB"
                mode="outlined"
                style={styles.input}
                value={formData.arAvcb}
                onChangeText={(t) => handleChange("arAvcb", t)}
              />
              <TextInput
                label="Prev. Aquática / Tipo"
                mode="outlined"
                style={styles.input}
                value={formData.prevencaoAquatica}
                onChangeText={(t) => handleChange("prevencaoAquatica", t)}
              />
            </Card.Content>
          </Card>
        ) : (
          <Card
            style={[styles.card, { borderColor: "#DAA520", borderWidth: 1 }]}
          >
            <Card.Title title="Dados Comunitários" />
            <Card.Content>
              <TextInput
                label="Tipo Interação"
                mode="outlined"
                style={styles.input}
                value={formData.tipoInteracao}
                onChangeText={(t) => handleChange("tipoInteracao", t)}
              />
              <TextInput
                label="Período"
                mode="outlined"
                style={styles.input}
                value={formData.periodo}
                onChangeText={(t) => handleChange("periodo", t)}
              />
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Detalhes da Execução</Text>
            <View style={styles.row}>
              <TextInput
                label="H. Chegada"
                style={[styles.input, styles.halfInput]}
                value={formData.dataChegada}
                onChangeText={(t) => handleChange("dataChegada", t)}
                placeholder="00:00"
              />
              <TextInput
                label="H. Saída"
                style={[styles.input, styles.halfInput]}
                value={formData.dataSaida}
                onChangeText={(t) => handleChange("dataSaida", t)}
                placeholder="00:00"
              />
            </View>

            <View style={styles.row}>
              <TextInput
                label="Público Est."
                keyboardType="numeric"
                style={[styles.input, styles.halfInput]}
                value={formData.publicoEstimado}
                onChangeText={(t) => handleChange("publicoEstimado", t)}
              />
              <TextInput
                label="Público Pres."
                keyboardType="numeric"
                style={[styles.input, styles.halfInput]}
                value={formData.publicoPresente}
                onChangeText={(t) => handleChange("publicoPresente", t)}
              />
            </View>

            <TextInput
              label="Serviços Realizados"
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              value={formData.servicosRealizados}
              onChangeText={(t) => handleChange("servicosRealizados", t)}
            />

            <TextInput
              label="Viaturas / Efetivo"
              mode="outlined"
              style={styles.input}
              value={formData.viaturasEmpregadas}
              onChangeText={(t) => handleChange("viaturasEmpregadas", t)}
            />

            <TextInput
              label="Resp. Guarnição"
              mode="outlined"
              style={styles.input}
              value={formData.responsavelGuarnicao}
              onChangeText={(t) => handleChange("responsavelGuarnicao", t)}
            />
          </Card.Content>
        </Card>

        {/* Mídia e Sensores */}
        <Card style={styles.card}>
          <Card.Title title="Evidências" />
          <Card.Content>
            <View style={styles.row}>
              <Button
                mode={location ? "contained-tonal" : "contained"}
                onPress={getLocation}
                loading={loadingMedia}
                icon="map-marker"
                style={{ flex: 1, marginRight: 8 }}
              >
                {location ? "Atualizar GPS" : "Pegar GPS"}
              </Button>

              <Button
                mode={photoUri ? "contained-tonal" : "contained"}
                onPress={takePhoto}
                icon="camera"
                style={{ flex: 1 }}
              >
                {photoUri ? "Trocar Foto" : "Tirar Foto"}
              </Button>
            </View>

            {location && (
              <View style={styles.mediaContainer}>
                {/* Mapa Visual */}
                <View style={styles.mapContainer}>
                  {location ? (
                    <MapView
                      style={styles.map}
                      region={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                      }}
                      scrollEnabled={false} // Trava o scroll para não brigar com a tela
                    >
                      <Marker
                        coordinate={location.coords}
                        title="Local da Ocorrência"
                      />
                    </MapView>
                  ) : (
                    <View style={styles.placeholderMap}>
                      <Text style={{ color: "#888" }}>
                        Mapa indisponível. Capture o GPS.
                      </Text>
                    </View>
                  )}
                  <Button
                    mode="contained"
                    onPress={getLocation}
                    loading={loadingMedia}
                    icon="map-marker"
                    style={styles.mapButton}
                  >
                    {location ? "Atualizar Posição" : "Capturar GPS"}
                  </Button>
                </View>
              </View>
            )}

            {photoUri && (
              <Image source={{ uri: photoUri }} style={styles.previewImage} />
            )}
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loadingSubmit}
          style={styles.submitButton}
          contentStyle={{ height: 50 }}
        >
          ENVIAR OCORRÊNCIA
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 50 },
  segmentedButton: { marginBottom: 16 },
  card: { marginBottom: 16, backgroundColor: "white" },
  input: { marginBottom: 12, backgroundColor: "white" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  halfInput: { width: "48%" },
  previewImage: { width: "100%", height: 200, borderRadius: 8, marginTop: 12 },
  submitButton: { marginTop: 10, backgroundColor: "#B22222" },
  mediaContainer: { marginBottom: 16 },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
    position: "relative",
  },
  map: { width: "100%", height: "100%" },
  placeholderMap: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  mapButton: { position: "absolute", bottom: 10, right: 10 },
});
