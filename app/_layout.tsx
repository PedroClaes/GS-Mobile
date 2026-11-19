import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { queryClient } from '../src/lib/queryClient';
import {
  criarEstilos,
  espacos,
  familias,
  fontes,
  TemaProvider,
  useTema,
} from '../src/theme';

// A splash nativa fica na tela até as fontes carregarem, para o primeiro
// quadro já sair com a identidade visual certa.
SplashScreen.preventAutoHideAsync().catch(() => {});

const FONTES = {
  Sora_700Bold: require('../assets/fonts/Sora_700Bold.ttf'),
  Sora_600SemiBold: require('../assets/fonts/Sora_600SemiBold.ttf'),
  Inter_400Regular: require('../assets/fonts/Inter_400Regular.ttf'),
  Inter_500Medium: require('../assets/fonts/Inter_500Medium.ttf'),
  Inter_600SemiBold: require('../assets/fonts/Inter_600SemiBold.ttf'),
  Inter_700Bold: require('../assets/fonts/Inter_700Bold.ttf'),
};

/**
 * Navegação raiz.
 *
 * O controle de acesso é feito pelo próprio sistema de rotas: `Stack.Protected`
 * tira da árvore o grupo que não vale para o estado atual. Sem sessão, nenhuma
 * tela de `(app)` existe — nem por deep link; com sessão, login e cadastro somem.
 */
function RotasDaAplicacao() {
  const { cores } = useTema();
  const styles = useEstilos();
  const { usuario, carregandoSessao } = useAuth();

  if (carregandoSessao) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={cores.primaria} size="large" />
        <Text style={styles.texto}>Restaurando sua sessão...</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Protected guard={usuario !== null}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={usuario === null}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

/** Barra de status e fundo da janela nativa acompanham o tema. */
function AparenciaDoSistema() {
  const { cores, esquema } = useTema();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(cores.fundo).catch(() => {});
  }, [cores.fundo]);

  return <StatusBar style={esquema === 'escuro' ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  const [fontesProntas, erroDasFontes] = useFonts(FONTES);
  const pronto = fontesProntas || erroDasFontes !== null;

  useEffect(() => {
    if (pronto) SplashScreen.hideAsync().catch(() => {});
  }, [pronto]);

  if (!pronto) return null;

  return (
    <SafeAreaProvider>
      <TemaProvider>
        <AparenciaDoSistema />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RotasDaAplicacao />
          </AuthProvider>
        </QueryClientProvider>
      </TemaProvider>
    </SafeAreaProvider>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    centro: {
      flex: 1,
      backgroundColor: cores.fundo,
      alignItems: 'center',
      justifyContent: 'center',
      padding: espacos.xxl,
    },
    texto: {
      color: cores.textoSecundario,
      marginTop: espacos.lg,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
    },
  })
);
