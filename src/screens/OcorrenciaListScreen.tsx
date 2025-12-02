import React, { useEffect, useState, useCallback } from "react";
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
import { api } from "../services/api";

// Definição rápida do tipo (pode importar do backend se preferir)
interface Ocorrencia {
  _id: string;
  tipoFormulario: string;
  nomeEvento: string;
  numeroAviso: string;
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

  // Recarrega a lista toda vez que a tela ganha foco (ex: voltou da edição)
  useFocusEffect(
    useCallback(() => {
      fetchOcorrencias();
    }, [])
  );

  const renderItem = ({ item }: { item: Ocorrencia }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate("Formulario", { ocorrencia: item })} // Passa os dados para edição
    >
      <Card.Title
        title={item.nomeEvento}
        subtitle={`Aviso: ${item.numeroAviso}`}
        right={(props) => (
          <Chip
            style={{
              marginRight: 16,
              backgroundColor:
                item.tipoFormulario === "PREVENCAO" ? "#e8f5e9" : "#fff3e0",
            }}
          >
            {item.tipoFormulario === "PREVENCAO" ? "Prev" : "Com"}
          </Chip>
        )}
      />
      <Card.Content>
        <Text variant="bodySmall" style={{ color: "#666" }}>
          Data: {new Date(item.createdAt).toLocaleDateString("pt-BR")}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
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

      {/* Botão Flutuante para Adicionar Nova */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="white"
        onPress={() => navigation.navigate("Formulario", { ocorrencia: null })} // Passa null para indicar criação
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  card: { marginBottom: 10, backgroundColor: "white" },
  fab: { position: "absolute", margin: 16, right: 0, bottom: 0 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#888" },
});
