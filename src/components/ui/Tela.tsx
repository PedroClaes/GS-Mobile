import type { ReactNode } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { criarEstilos, espacos, useTema } from '../../theme';

type Props = {
  children: ReactNode;
  rolavel?: boolean;
  style?: ViewStyle;
  /**
   * Respeita a barra de status no topo. Só as telas sem cabeçalho de
   * navegação (login e cadastro) precisam: nas demais, o cabeçalho já cuida.
   */
  areaSegura?: boolean;
  /** Habilita "puxar para atualizar", forçando a revalidação dos dados remotos. */
  aoAtualizar?: () => void;
  atualizando?: boolean;
};

/** Contêiner padrão das telas: fundo, respiro lateral e rolagem opcional. */
export function Tela({
  children,
  rolavel = true,
  style,
  areaSegura = false,
  aoAtualizar,
  atualizando = false,
}: Props) {
  const { cores } = useTema();
  const styles = useEstilos();

  const conteudo = !rolavel ? (
    <View style={[styles.base, styles.conteudo, style]}>{children}</View>
  ) : (
    <ScrollView
      style={styles.base}
      contentContainerStyle={[styles.conteudo, style]}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        aoAtualizar ? (
          <RefreshControl
            refreshing={atualizando}
            onRefresh={aoAtualizar}
            tintColor={cores.primaria}
            colors={[cores.primaria]}
            progressBackgroundColor={cores.superficie}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );

  if (!areaSegura) return conteudo;
  return (
    <SafeAreaView style={styles.base} edges={['top']}>
      {conteudo}
    </SafeAreaView>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    base: { flex: 1, backgroundColor: cores.fundo },
    conteudo: { padding: espacos.xl, paddingBottom: espacos.xxl * 2 },
  })
);
