import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native';

import { criarEstilos, espacos, familias, raios, useTema } from '../../theme';

type Variante = 'primario' | 'secundario' | 'perigo';

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  carregando?: boolean;
  desabilitado?: boolean;
  style?: ViewStyle;
};

/** Botão padrão com estado de carregamento embutido. */
export function Botao({
  titulo,
  onPress,
  variante = 'primario',
  carregando = false,
  desabilitado = false,
  style,
}: Props) {
  const { cores } = useTema();
  const styles = useEstilos();
  const inativo = desabilitado || carregando;

  return (
    <TouchableOpacity
      style={[styles.base, styles[variante], inativo && styles.inativo, style]}
      onPress={onPress}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityState={{ disabled: inativo, busy: carregando }}
    >
      {carregando ? (
        <ActivityIndicator
          color={variante === 'secundario' ? cores.primaria : cores.textoSobrePrimaria}
        />
      ) : (
        <Text style={[styles.texto, variante === 'secundario' && styles.textoSecundario]}>
          {titulo}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    base: {
      height: 50,
      borderRadius: raios.md,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: espacos.lg,
    },
    primario: { backgroundColor: cores.primaria },
    secundario: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: cores.borda,
    },
    perigo: { backgroundColor: cores.erro },
    inativo: { opacity: 0.5 },
    texto: {
      color: cores.textoSobrePrimaria,
      fontFamily: familias.textoNegrito,
      fontSize: 15,
    },
    textoSecundario: { color: cores.textoSecundario },
  })
);
