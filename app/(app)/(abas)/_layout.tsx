import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { useAuth } from '../../../src/contexts/AuthContext';
import { criarEstilos, familias, useTema } from '../../../src/theme';

function icone(emoji: string) {
  return function Icone({ focused }: { focused: boolean }) {
    return (
      <Text style={[estilosFixos.icone, !focused && estilosFixos.iconeInativo]}>
        {emoji}
      </Text>
    );
  };
}

/**
 * Abas do app. O conjunto muda conforme o papel vindo do login:
 * - CIDADAO: Cidade, Minhas e Conta;
 * - GESTOR: Fila (ordenada por prioridade), Cidade e Conta.
 */
export default function AbasLayout() {
  const { cores } = useTema();
  const styles = useEstilos();
  const { usuario } = useAuth();
  const gestor = usuario?.papel === 'GESTOR';

  return (
    <Tabs
      backBehavior="history"
      initialRouteName={gestor ? 'fila' : 'index'}
      screenOptions={{
        headerStyle: { backgroundColor: cores.superficie },
        headerTitleStyle: {
          fontFamily: familias.titulo,
          color: cores.texto,
          fontSize: 20,
        },
        headerShadowVisible: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarLabelStyle: estilosFixos.rotulo,
        sceneStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Tabs.Protected guard={gestor}>
        <Tabs.Screen
          name="fila"
          options={{
            title: 'Fila',
            headerTitle: 'Fila de atendimento',
            tabBarIcon: icone('📋'),
          }}
        />
      </Tabs.Protected>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Cidade',
          headerTitle: 'Ocorrências da cidade',
          tabBarIcon: icone('🏙️'),
        }}
      />

      <Tabs.Protected guard={!gestor}>
        <Tabs.Screen
          name="minhas"
          options={{
            title: 'Minhas',
            headerTitle: 'Minhas ocorrências',
            tabBarIcon: icone('📍'),
          }}
        />
      </Tabs.Protected>

      <Tabs.Screen
        name="conta"
        options={{ title: 'Conta', headerTitle: 'Minha conta', tabBarIcon: icone('👤') }}
      />
    </Tabs>
  );
}

const estilosFixos = StyleSheet.create({
  icone: { fontSize: 18 },
  iconeInativo: { opacity: 0.5 },
  rotulo: { fontSize: 11, fontFamily: familias.textoForte },
});

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: cores.superficie,
      borderTopColor: cores.borda,
      borderTopWidth: 1,
    },
  })
);
