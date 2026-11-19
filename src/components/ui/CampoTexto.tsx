import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { criarEstilos, espacos, familias, fontes, raios, useTema } from '../../theme';

type Props = TextInputProps & {
  rotulo: string;
  erro?: string;
  /** Texto de apoio exibido abaixo do campo quando não há erro. */
  dica?: string;
};

/** Campo de formulário com rótulo, dica e mensagem de validação. */
export function CampoTexto({ rotulo, erro, dica, multiline, style, ...props }: Props) {
  const { cores } = useTema();
  const styles = useEstilos();

  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilinha,
          !!erro && styles.inputComErro,
          style,
        ]}
        placeholderTextColor={cores.textoTerciario}
        multiline={multiline}
        accessibilityLabel={rotulo}
        {...props}
      />
      {erro ? (
        <Text style={styles.erro} accessibilityRole="alert">
          {erro}
        </Text>
      ) : (
        !!dica && <Text style={styles.dica}>{dica}</Text>
      )}
    </View>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    container: { marginBottom: espacos.lg },
    rotulo: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      marginBottom: espacos.sm,
      fontFamily: familias.textoForte,
    },
    input: {
      minHeight: 48,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: raios.sm,
      paddingHorizontal: espacos.md,
      backgroundColor: cores.superficie,
      color: cores.texto,
      fontFamily: familias.texto,
      fontSize: fontes.corpo,
    },
    multilinha: {
      minHeight: 110,
      paddingTop: espacos.md,
      paddingBottom: espacos.md,
      textAlignVertical: 'top',
    },
    inputComErro: { borderColor: cores.erro },
    erro: {
      color: cores.erro,
      fontSize: fontes.mini,
      fontFamily: familias.textoMedio,
      marginTop: espacos.xs,
    },
    dica: {
      color: cores.textoTerciario,
      fontSize: fontes.mini,
      fontFamily: familias.texto,
      marginTop: espacos.xs,
    },
  })
);
