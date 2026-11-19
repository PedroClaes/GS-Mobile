import { Stack } from 'expo-router';

import { useAuth } from '../../src/contexts/AuthContext';
import { familias, useTema } from '../../src/theme';

/**
 * Telas do app autenticado. As abas ficam em `(abas)`; o resto abre por cima
 * delas, com cabeçalho e botão de voltar.
 *
 * Além do login, o papel do usuário também protege rotas: abrir e editar
 * ocorrência só existe para CIDADAO, mudar status só para GESTOR. A API
 * recusaria de qualquer jeito (403), mas assim a tela nem é alcançável.
 */
export default function AppLayout() {
  const { cores } = useTema();
  const { usuario } = useAuth();
  const cidadao = usuario?.papel === 'CIDADAO';
  const gestor = usuario?.papel === 'GESTOR';

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: cores.superficie },
        headerTintColor: cores.primaria,
        headerTitleStyle: { fontFamily: familias.tituloMedio, color: cores.texto },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Screen name="(abas)" options={{ headerShown: false }} />
      <Stack.Screen name="ocorrencias/[id]/index" options={{ title: 'Ocorrência' }} />
      <Stack.Screen
        name="comentarios/novo"
        options={{ title: 'Novo comentário', presentation: 'modal' }}
      />
      <Stack.Screen
        name="comentarios/[id]"
        options={{ title: 'Editar comentário', presentation: 'modal' }}
      />
      <Stack.Screen name="sobre" options={{ title: 'Sobre o App' }} />

      <Stack.Protected guard={cidadao}>
        <Stack.Screen name="ocorrencias/nova" options={{ title: 'Nova ocorrência' }} />
        <Stack.Screen
          name="ocorrencias/[id]/editar"
          options={{ title: 'Editar ocorrência' }}
        />
      </Stack.Protected>

      <Stack.Protected guard={gestor}>
        <Stack.Screen
          name="ocorrencias/[id]/status"
          options={{ title: 'Atualizar status', presentation: 'modal' }}
        />
      </Stack.Protected>
    </Stack>
  );
}
