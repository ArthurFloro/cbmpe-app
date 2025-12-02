import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { FAB, Card, Text, Chip, Avatar, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// URL da sua API (quando estiver rodando)
const API_URL = 'http://192.168.1.2:3000';

// Tipagem simples dos dados
interface Ocorrencia {
  id: string;
  titulo: string;
  tipo: 'prevencao' | 'comunitaria';
  data: string;
  status: 'enviado' | 'pendente';
  local?: string;
}

export function Home() {
  const navigation = useNavigation<any>();
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Simulação de busca de dados (Substitua pelo fetch real depois)
  const fetchData = async () => {
    setRefreshing(true);
    try {
      // const res = await fetch(`${API_URL}/ocorrencias`);
      // const data = await res.json();
      
      // --- DADOS FAKE PARA TESTE ---
      const data: Ocorrencia[] = [
        { id: '1', titulo: 'Prevenção na Orla', tipo: 'prevencao', data: '01/12/2025', status: 'enviado', local: 'Boa Viagem' },
        { id: '2', titulo: 'Palestras Escolares', tipo: 'comunitaria', data: '02/12/2025', status: 'pendente', local: 'Escola Municipal A' },
        { id: '3', titulo: 'Vistoria Galo da Madrugada', tipo: 'prevencao', data: '03/12/2025', status: 'enviado', local: 'Centro' },
      ];
      // -----------------------------
      
      setOcorrencias(data);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Função para renderizar cada item da lista
  const renderItem = ({ item }: { item: Ocorrencia }) => {
    // Define a cor baseada no tipo (Verde ou Caqui)
    const color = item.tipo === 'prevencao' ? '#2E7D32' : '#C49000';
    const icon = item.tipo === 'prevencao' ? 'shield-check' : 'account-group';

    return (
      <Card style={[styles.card, { borderLeftColor: color, borderLeftWidth: 5 }]} mode="elevated">
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.titulo}</Text>
              <Text variant="bodySmall" style={{ color: 'gray' }}>{item.data} • {item.local}</Text>
            </View>
            <Avatar.Icon size={40} icon={icon} style={{ backgroundColor: color }} color="white" />
          </View>

          <View style={styles.cardFooter}>
            <Chip 
              icon="information" 
              style={{ backgroundColor: 'transparent', paddingLeft: 0 }} 
              textStyle={{ color: color }}
            >
              {item.tipo === 'prevencao' ? 'Prevenção' : 'Comunitária'}
            </Chip>
            
            {/* Status (Ex: Sincronizado ou Pendente) */}
            <IconButton 
              icon={item.status === 'enviado' ? "cloud-check" : "cloud-upload"} 
              iconColor={item.status === 'enviado' ? "green" : "orange"}
              size={20}
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={ocorrencias}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={{color: 'gray'}}>Nenhuma ocorrência registrada.</Text>
            </View>
        }
      />
      
      {/* Botão Flutuante para Adicionar Nova Ocorrência */}
      <FAB
        icon="plus"
        label="Nova Ocorrência"
        style={styles.fab}
        color="white"
        onPress={() => navigation.navigate('NovaOcorrencia')} 
        // OBS: Você precisará criar essa rota 'NovaOcorrencia' com o código do formulário antigo
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Espaço para o FAB não cobrir o último item
  },
  card: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#B71C1C', // Vermelho Bombeiro
  },
  emptyContainer: {
      flex: 1,
      alignItems: 'center',
      marginTop: 50
  }
});