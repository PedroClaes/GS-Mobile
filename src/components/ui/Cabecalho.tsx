import { StyleSheet, Text, View } from 'react-native';

import { criarEstilos, espacos, familias, fontes } from '../../theme';

/** Título e subtítulo padrão no topo das telas. */
export function Cabecalho({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) {
  const styles = useEstilos();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
      {!!subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}
    </View>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    container: { marginBottom: espacos.xl },
    titulo: { color: cores.texto, fontSize: fontes.titulo, fontFamily: familias.titulo },
    subtitulo: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
      marginTop: espacos.xs,
    },
  })
);
