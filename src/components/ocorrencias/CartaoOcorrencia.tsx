import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { tempoDecorrido } from '../../domain/ocorrencias';
import { criarEstilos, espacos, familias, fontes, raios } from '../../theme';
import type { Ocorrencia } from '../../types';
import { SelosDaOcorrencia } from './SelosDaOcorrencia';

type Props = {
  ocorrencia: Ocorrencia;
  aoPressionar: () => void;
  /** Mostra a barra de prioridade (fila do gestor). */
  mostrarPrioridade?: boolean;
};

/** Item das listas de ocorrências. */
export function CartaoOcorrencia({
  ocorrencia,
  aoPressionar,
  mostrarPrioridade = false,
}: Props) {
  const styles = useEstilos();
  const prioridade = ocorrencia.prioridade ?? 0;

  return (
    <TouchableOpacity
      style={styles.cartao}
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityLabel={`Ocorrência ${ocorrencia.titulo}, ${ocorrencia.bairro}`}
    >
      <View style={styles.topo}>
        <Text style={styles.categoria} numberOfLines={1}>
          {ocorrencia.categoria?.nome ?? 'Aguardando classificação'}
        </Text>
        <Text style={styles.tempo}>
          #{ocorrencia.id} · {tempoDecorrido(ocorrencia.criadoEm)}
        </Text>
      </View>

      <Text style={styles.titulo} numberOfLines={2}>
        {ocorrencia.titulo}
      </Text>
      <Text style={styles.local} numberOfLines={1}>
        📍 {ocorrencia.endereco} · {ocorrencia.bairro}
      </Text>

      <SelosDaOcorrencia ocorrencia={ocorrencia} />

      <View style={styles.rodape}>
        <Text style={styles.apoios}>
          👍 {ocorrencia.qtdApoios} {ocorrencia.qtdApoios === 1 ? 'apoio' : 'apoios'}
        </Text>
        {mostrarPrioridade && (
          <View
            style={styles.prioridade}
            accessibilityLabel={`Prioridade ${prioridade} de 100`}
          >
            <View style={styles.trilho}>
              <View style={[styles.barra, { width: `${Math.min(100, prioridade)}%` }]} />
            </View>
            <Text style={styles.prioridadeTexto}>{prioridade}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    cartao: {
      backgroundColor: cores.superficie,
      borderRadius: raios.lg,
      borderWidth: 1,
      borderColor: cores.borda,
      padding: espacos.lg,
      marginBottom: espacos.md,
      gap: espacos.sm,
    },
    topo: { flexDirection: 'row', justifyContent: 'space-between', gap: espacos.sm },
    categoria: {
      color: cores.primaria,
      fontSize: fontes.mini,
      fontFamily: familias.textoNegrito,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      flex: 1,
    },
    tempo: {
      color: cores.textoTerciario,
      fontSize: fontes.mini,
      fontFamily: familias.texto,
    },
    titulo: {
      color: cores.texto,
      fontSize: fontes.corpo + 1,
      fontFamily: familias.tituloMedio,
    },
    local: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
    },
    rodape: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: espacos.xs,
    },
    apoios: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.textoForte,
    },
    prioridade: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: espacos.sm,
      flex: 1,
      marginLeft: espacos.lg,
    },
    trilho: {
      flex: 1,
      height: 6,
      borderRadius: 3,
      backgroundColor: cores.superficieAlta,
    },
    barra: { height: 6, borderRadius: 3, backgroundColor: cores.primaria },
    prioridadeTexto: {
      color: cores.texto,
      fontSize: fontes.auxiliar,
      fontFamily: familias.textoNegrito,
    },
  })
);
