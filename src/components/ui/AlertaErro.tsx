import { StyleSheet, Text, View } from 'react-native';

import { criarEstilos, espacos, familias, fontes, raios } from '../../theme';

/**
 * Caixa de erro exibida acima do botão de envio dos formulários.
 * Não renderiza nada quando não há mensagem.
 */
export function AlertaErro({ mensagem }: { mensagem?: string | null }) {
  const styles = useEstilos();
  if (!mensagem) return null;

  return (
    <View style={styles.caixa} accessibilityRole="alert">
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    caixa: {
      backgroundColor: cores.erroSuave,
      borderColor: cores.erro,
      borderWidth: 1,
      borderRadius: raios.sm,
      padding: espacos.md,
      marginBottom: espacos.lg,
    },
    texto: {
      color: cores.erro,
      fontSize: fontes.auxiliar,
      fontFamily: familias.textoMedio,
    },
  })
);
