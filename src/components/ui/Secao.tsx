import { StyleSheet, Text } from 'react-native';

import { criarEstilos, espacos, familias, fontes } from '../../theme';

/** Título de seção reutilizado nas telas de listagem e dashboard. */
export function Secao({ children }: { children: string }) {
  const styles = useEstilos();
  return <Text style={styles.titulo}>{children}</Text>;
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    titulo: {
      color: cores.primaria,
      fontSize: fontes.secao,
      fontFamily: familias.textoNegrito,
      marginBottom: espacos.md,
      marginTop: espacos.sm,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
  })
);
