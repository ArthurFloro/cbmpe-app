import React from "react";
import { ImageBackground, View } from "react-native";
import cbmpeBackground from "../../assets/cbmpe-background.jpeg";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export function InitialScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={cbmpeBackground}
        resizeMode="cover"
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,

            backgroundColor: "rgba(0,0,0,0.85)",

            justifyContent: "flex-end",
            alignItems: "center",

            paddingHorizontal: 24,
            paddingBottom: 40,
          }}
        >
          <View style={{ marginBottom: 30, alignItems: "center" }}>
            <Text
              variant="headlineMedium"
              style={{
                color: "#FFFFFF",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Serviço Operacional
            </Text>
            <Text
              variant="bodyLarge"
              style={{
                color: "#E0E0E0",
                textAlign: "center",
              }}
            >
              Toque abaixo para iniciar um novo registro de ocorrência.
            </Text>
          </View>

          <Button
            icon="camera-plus"
            mode="contained"
            onPress={() => navigation.navigate("ListaOcorrencias")}
            style={{
              width: "100%",
              borderRadius: 8,
              backgroundColor: "#D32F2F",
            }}
            contentStyle={{
              paddingVertical: 6,
            }}
            labelStyle={{
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Cadastrar Nova Ocorrência
          </Button>
        </View>
      </ImageBackground>
    </View>
  );
}
