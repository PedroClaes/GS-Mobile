import { Stack } from 'expo-router';

import { useTema } from '../../src/theme';

/** Fluxo público: apenas login e cadastro são alcançáveis sem autenticação. */
export default function AuthLayout() {
  const { cores } = useTema();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
    </Stack>
  );
}
