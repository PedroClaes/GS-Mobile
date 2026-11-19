import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { criarEstilos, espacos, familias, raios } from '../../theme';

/** Ação principal da tela, fixa no canto inferior (padrão FAB do Material). */
export function BotaoFlutuante({
  titulo,
  aoPressionar,
}: {
  titulo: string;
  aoPressionar: () => void;
}) {
  const styles = useEstilos();
  return (
    <TouchableOpacity
      style={styles.botao}
      onPress={aoPressionar}
      accessibilityRole="button"
    >
      <Text style={styles.texto}>＋ {titulo}</Text>
    </TouchableOpacity>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    botao: {
      position: 'absolute',
      right: espacos.lg,
      bottom: espacos.lg,
      backgroundColor: cores.primaria,
      borderRadius: raios.pilula,
      paddingHorizontal: espacos.xl,
      paddingVertical: espacos.md + 2,
      elevation: 4,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },
    texto: {
      color: cores.textoSobrePrimaria,
      fontFamily: familias.textoNegrito,
      fontSize: 15,
    },
  })
);
