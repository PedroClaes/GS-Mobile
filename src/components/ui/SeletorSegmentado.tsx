import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { criarEstilos, espacos, familias, fontes, raios } from '../../theme';

export type OpcaoSegmentada<T extends string> = {
  valor: T;
  rotulo: string;
};

type Props<T extends string> = {
  opcoes: OpcaoSegmentada<T>[];
  selecionado: T;
  aoSelecionar: (valor: T) => void;
};

/** Grupo de botões mutuamente exclusivos (ex.: Sistema / Claro / Escuro). */
export function SeletorSegmentado<T extends string>({
  opcoes,
  selecionado,
  aoSelecionar,
}: Props<T>) {
  const styles = useEstilos();

  return (
    <View style={styles.container} accessibilityRole="radiogroup">
      {opcoes.map((opcao) => {
        const ativo = opcao.valor === selecionado;
        return (
          <TouchableOpacity
            key={opcao.valor}
            style={[styles.opcao, ativo && styles.opcaoAtiva]}
            onPress={() => aoSelecionar(opcao.valor)}
            accessibilityRole="radio"
            accessibilityState={{ selected: ativo }}
          >
            <Text style={[styles.texto, ativo && styles.textoAtivo]}>{opcao.rotulo}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: cores.superficie,
      borderRadius: raios.md,
      padding: espacos.xs,
      marginBottom: espacos.sm,
    },
    opcao: {
      flex: 1,
      paddingVertical: espacos.md,
      borderRadius: raios.sm,
      alignItems: 'center',
    },
    opcaoAtiva: { backgroundColor: cores.primaria },
    texto: {
      color: cores.textoSecundario,
      fontFamily: familias.textoForte,
      fontSize: fontes.auxiliar,
    },
    textoAtivo: { color: cores.textoSobrePrimaria },
  })
);
