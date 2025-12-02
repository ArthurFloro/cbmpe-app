import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define o formato da localização (igual ao que o MapView espera)
interface LocationCoords {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Define o formato do Contexto (o que fica disponivel para o app)
interface LocationContextData {
  userLocation: LocationCoords | null;
  setUserLocation: React.Dispatch<React.SetStateAction<LocationCoords | null>>;
}

// Cria o contexto tipado
// O "as LocationContextData" é o truque para iniciar vazio sem o TS reclamar
const LocationContext = createContext<LocationContextData>({} as LocationContextData);

interface ProviderProps {
  children: ReactNode;
}

export function LocationProvider({ children }: ProviderProps) {
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);

  return (
    <LocationContext.Provider value={{ userLocation, setUserLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  return context;
}