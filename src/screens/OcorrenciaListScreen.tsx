import React, { useState, useCallback } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import {
  Card,
  Text,
  FAB,
  Chip,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { api, BASE_URL } from "../services/api"; // 

interface Ocorrencia {
  _id: string;
  tipoFormulario: string;
  nomeEvento: string;
  numeroAviso: string;
  foto?: string; 
  createdAt: string;
}

export function OcorrenciaListScreen() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  const theme = useTheme();

  const fetchOcorrencias = async () => {
    setLoading(true);
    try {
      const response = await api.get("/ocorrencias");
      setOcorrencias(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOcorrencias();
    }, [])
  );

  const renderItem = ({ item }: { item: Ocorrencia }) => {
    let imageUrl = null;
    if (item.foto) {
      const cleanPath = item.foto.replace(/\\/g, "/");
      imageUrl = `${BASE_URL}/${cleanPath}`;
    }

    return (
      <Card
        style={styles.card}
        onPress={() => navigation.navigate("Formulario", { ocorrencia: item })}
        mode="elevated"
      >
        {imageUrl && (
          <Card.Cover source={{ uri: imageUrl }} style={styles.cardImage} />
        )}

        <Card.Title
          title={item.nomeEvento}
          titleStyle={{ fontWeight: "bold" }}
          subtitle={`Aviso: ${item.numeroAviso}`}
          right={(props) => (
            <View style={{ marginRight: 16 }}>
              <Chip
                compact
                style={{
                  backgroundColor:
                    item.tipoFormulario === "PREVENCAO" ? "#e8f5e9" : "#fff3e0",
                }}
                textStyle={{ fontSize: 10, color: "#333" }}
              >
                {item.tipoFormulario === "PREVENCAO" ? "PREV" : "COM"}
              </Chip>
            </View>
          )}
        />
        <Card.Content>
          <Text variant="bodySmall" style={{ color: "#666" }}>
            Data: {new Date(item.createdAt).toLocaleDateString("pt-BR")}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={ocorrencias}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchOcorrencias} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma ocorrência registrada.</Text>
          }
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="white"
        onPress={() => navigation.navigate("Formulario", { ocorrencia: null })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  card: { marginBottom: 16, backgroundColor: "white", overflow: "hidden" }, 
  cardImage: { height: 150 }, 
  fab: { position: "absolute", margin: 16, right: 0, bottom: 0 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#888" },
});
