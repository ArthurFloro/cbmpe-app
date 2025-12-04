import React, { useEffect, useState } from "react";
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
} from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useOcorrenciaMedia } from "../hooks/useOcorrenciaMedia";
import { api, BASE_URL } from "../services/api";

export function OcorrenciaFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const ocorrenciaEditar = route.params?.ocorrencia;

  const {
    location,
    photoUri,
    getLocation,
    takePhoto,
    setPhotoUri,
    loading: loadingMedia,
  } = useOcorrenciaMedia();

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [tipoFormulario, setTipoFormulario] = useState("PREVENCAO");

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
    arAvcb: "",
    prevencaoAquatica: "",
    periodo: "",
    tipoInteracao: "",
  });

  useEffect(() => {
    if (ocorrenciaEditar) {
      navigation.setOptions({ title: "Editar Ocorrência" });

      setTipoFormulario(ocorrenciaEditar.tipoFormulario);
      setFormData({
        numeroAviso: ocorrenciaEditar.numeroAviso || "",
        nomeEvento: ocorrenciaEditar.nomeEvento || "",
        codigoCGO: ocorrenciaEditar.codigoCGO || "",
        dataChegada: ocorrenciaEditar.dataChegada || "",
        dataInicio: ocorrenciaEditar.dataInicio || "",
        dataSaida: ocorrenciaEditar.dataSaida || "",
        publicoEstimado: String(ocorrenciaEditar.publico?.estimado || ""),
        publicoPresente: String(ocorrenciaEditar.publico?.presente || ""),
        servicosRealizados: ocorrenciaEditar.servicosRealizados || "",
        viaturasEmpregadas: ocorrenciaEditar.viaturasEmpregadas || "",
        responsavelGuarnicao: ocorrenciaEditar.responsavelGuarnicao || "",
        informacoesAdicionais: ocorrenciaEditar.informacoesAdicionais || "",
        arAvcb: ocorrenciaEditar.responsavelEvento?.arAvcb || "",
        prevencaoAquatica: ocorrenciaEditar.prevencaoAquatica || "",
        periodo: ocorrenciaEditar.periodo || "",
        tipoInteracao: ocorrenciaEditar.tipoInteracao || "",
      });

      if (ocorrenciaEditar.foto) {
        const cleanPath = ocorrenciaEditar.foto.replace(/\\/g, "/");
        setPhotoUri(`${BASE_URL}/${cleanPath}`);
      }
    }
  }, [ocorrenciaEditar]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    Alert.alert(
      "Excluir Ocorrência",
      "Tem certeza que deseja excluir este registro? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setLoadingSubmit(true);
              await api.delete(`/ocorrencias/${ocorrenciaEditar._id}`);
              Alert.alert("Sucesso", "Ocorrência excluída.");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir.");
            } finally {
              setLoadingSubmit(false);
            }
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    // Validação básica
    if (!formData.numeroAviso || !formData.nomeEvento) {
      Alert.alert("Atenção", "Campos Aviso e Evento são obrigatórios.");
      return;
    }

    if (!ocorrenciaEditar && (!location || !photoUri)) {
      Alert.alert(
        "Atenção",
        "Para novas ocorrências, GPS e Foto são obrigatórios."
      );
      return;
    }

    setLoadingSubmit(true);

    try {
      const data = new FormData();

      data.append("tipoFormulario", tipoFormulario);

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value ? String(value) : "");
      });

      data.append(
        "publico[estimado]",
        formData.publicoEstimado ? String(formData.publicoEstimado) : "0"
      );
      data.append(
        "publico[presente]",
        formData.publicoPresente ? String(formData.publicoPresente) : "0"
      );

      if (location) {
        data.append("latitude", String(location.coords.latitude));
        data.append("longitude", String(location.coords.longitude));
      }

      if (photoUri && !photoUri.startsWith("http")) {
        const filename = photoUri.split("/").pop() || `foto-${Date.now()}.jpg`;

        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        const uriClean =
          Platform.OS === "ios" ? photoUri.replace("file://", "") : photoUri;

        data.append("foto", {
          uri: uriClean,
          name: filename,
          type: type,
        } as any);
      }

      console.log("Enviando...", JSON.stringify(formData));

      if (ocorrenciaEditar) {
        await api.put(`/ocorrencias/${ocorrenciaEditar._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Alert.alert("Sucesso", "Dados atualizados!");
      } else {
        await api.post("/ocorrencias", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Alert.alert("Sucesso", "Ocorrência registrada!");
      }

      navigation.goBack();
    } catch (error: any) {
      console.error("Erro detalhado:", error);

      if (error.response) {
        Alert.alert(
          "Erro do Servidor",
          `Status: ${error.response.status}\n${JSON.stringify(
            error.response.data
          )}`
        );
      } else if (error.request) {
        Alert.alert(
          "Erro de Conexão",
          "O servidor não respondeu. Verifique o IP."
        );
      } else {
        Alert.alert("Erro Interno", error.message);
      }
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
              style={styles.input}
              value={formData.servicosRealizados}
              onChangeText={(t) => handleChange("servicosRealizados", t)}
            />
            <TextInput
              label="Viaturas"
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

        <Card style={styles.card}>
          <Card.Title title="Evidências" subtitle="Localização e Foto" />
          <Card.Content>
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
                  scrollEnabled={false}
                >
                  <Marker coordinate={location.coords} title="Local" />
                </MapView>
              ) : (
                <View style={styles.placeholderMap}>
                  <Text style={{ color: "#888" }}>
                    {ocorrenciaEditar
                      ? "GPS salvo no banco. Clique para atualizar."
                      : "Mapa indisponível. Capture o GPS."}
                  </Text>
                </View>
              )}
            </View>
            <Button
              mode="outlined"
              onPress={getLocation}
              loading={loadingMedia}
              icon="map-marker"
              style={{ marginBottom: 10 }}
            >
              {location ? "Atualizar Localização" : "Capturar Localização"}
            </Button>

            {photoUri && (
              <Image source={{ uri: photoUri }} style={styles.previewImage} />
            )}
            <Button
              mode="contained"
              onPress={takePhoto}
              icon="camera"
              style={{ marginTop: 10 }}
            >
              {photoUri ? "Alterar Foto" : "Tirar Foto"}
            </Button>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loadingSubmit}
          style={styles.submitButton}
          contentStyle={{ height: 50 }}
        >
          {ocorrenciaEditar ? "SALVAR ALTERAÇÕES" : "ENVIAR OCORRÊNCIA"}
        </Button>

        {ocorrenciaEditar && (
          <Button
            mode="outlined"
            onPress={handleDelete}
            textColor="red"
            style={{ marginTop: 16, borderColor: "red" }}
            icon="trash-can"
          >
            Excluir Ocorrência
          </Button>
        )}
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
