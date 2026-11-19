import { StyleSheet, Text, View } from 'react-native';

import {
  corDoStatus,
  formatarDataHora,
  ROTULO_DO_STATUS,
} from '../../domain/ocorrencias';
import { criarEstilos, espacos, familias, fontes, useTema } from '../../theme';
import type { HistoricoStatus } from '../../types';

/** Histórico de mudanças de status, do mais antigo ao mais recente. */
export function LinhaDoTempo({ historico }: { historico: HistoricoStatus[] }) {
  const { cores } = useTema();
  const styles = useEstilos();

  if (historico.length === 0) {
    return <Text style={styles.vazio}>Nenhuma mudança de status ainda.</Text>;
  }

  return (
    <View style={styles.lista}>
      {historico.map((item, indice) => {
        const cor = corDoStatus(item.statusNovo, cores);
        const ultimo = indice === historico.length - 1;
        return (
          <View key={`${item.data}-${indice}`} style={styles.item}>
            <View style={styles.marcador}>
              <View style={[styles.ponto, { backgroundColor: cor }]} />
              {!ultimo && <View style={styles.trilho} />}
            </View>
            <View style={styles.conteudo}>
              <Text style={[styles.status, { color: cor }]}>
                {ROTULO_DO_STATUS[item.statusNovo]}
              </Text>
              <Text style={styles.meta}>
                {formatarDataHora(item.data)} · {item.responsavel}
              </Text>
              {!!item.observacao && (
                <Text style={styles.observacao}>{item.observacao}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    lista: { marginBottom: espacos.lg },
    item: { flexDirection: 'row', gap: espacos.md },
    marcador: { alignItems: 'center', width: 14 },
    ponto: { width: 12, height: 12, borderRadius: 6, marginTop: 3 },
    trilho: { flex: 1, width: 2, backgroundColor: cores.borda, marginVertical: 2 },
    conteudo: { flex: 1, paddingBottom: espacos.lg },
    status: { fontSize: fontes.corpo, fontFamily: familias.textoNegrito },
    meta: {
      color: cores.textoTerciario,
      fontSize: fontes.mini,
      fontFamily: familias.texto,
      marginTop: 2,
    },
    observacao: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
      marginTop: espacos.xs,
    },
    vazio: {
      color: cores.textoTerciario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
      marginBottom: espacos.lg,
    },
  })
);
