import { StyleSheet, Text, View } from 'react-native';

import { espacos, familias, fontes, raios } from '../../theme';

type Props = {
  texto: string;
  cor: string;
  /** Selo preenchido (cor sólida) em vez do contorno translúcido. */
  solido?: boolean;
};

/** Etiqueta curta e colorida para status, urgência e marcações da IA. */
export function Selo({ texto, cor, solido = false }: Props) {
  return (
    <View
      style={[
        styles.selo,
        { borderColor: cor, backgroundColor: solido ? cor : `${cor}1F` },
      ]}
    >
      <Text style={[styles.texto, { color: solido ? '#FFFFFF' : cor }]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  selo: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: raios.pilula,
    paddingHorizontal: espacos.sm,
    paddingVertical: 2,
  },
  texto: { fontSize: fontes.mini, fontFamily: familias.textoNegrito, letterSpacing: 0.3 },
});
