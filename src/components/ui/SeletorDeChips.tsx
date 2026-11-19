import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { criarEstilos, espacos, familias, fontes, raios } from '../../theme';

export type OpcaoDeChip<T> = { valor: T; rotulo: string };

type Props<T> = {
  opcoes: OpcaoDeChip<T>[];
  /** Valores marcados. Na seleção única, o array tem no máximo um item. */
  selecionados: T[];
  aoAlternar: (valor: T) => void;
  /** Rolagem horizontal numa linha (filtros) ou quebra de linha (formulários). */
  emLinha?: boolean;
};

/** Grupo de chips para filtros e escolhas (categoria, status, etiquetas). */
export function SeletorDeChips<T extends string | number | null>({
  opcoes,
  selecionados,
  aoAlternar,
  emLinha = false,
}: Props<T>) {
  const styles = useEstilos();

  const chips = opcoes.map((opcao) => {
    const ativo = selecionados.includes(opcao.valor);
    return (
      <TouchableOpacity
        key={String(opcao.valor)}
        style={[styles.chip, ativo && styles.chipAtivo]}
        onPress={() => aoAlternar(opcao.valor)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: ativo }}
      >
        <Text style={[styles.texto, ativo && styles.textoAtivo]}>{opcao.rotulo}</Text>
      </TouchableOpacity>
    );
  });

  if (emLinha) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.linha}
      >
        {chips}
      </ScrollView>
    );
  }
  return <View style={styles.grade}>{chips}</View>;
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    linha: { gap: espacos.sm, paddingVertical: espacos.xs },
    grade: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: espacos.sm,
      marginBottom: espacos.lg,
    },
    chip: {
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
      borderRadius: raios.pilula,
      paddingHorizontal: espacos.md,
      paddingVertical: espacos.sm,
    },
    chipAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
    texto: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.textoForte,
    },
    textoAtivo: { color: cores.textoSobrePrimaria },
  })
);
