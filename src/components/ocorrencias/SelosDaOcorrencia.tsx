import { StyleSheet, View } from 'react-native';

import {
  corDaUrgencia,
  corDoStatus,
  ROTULO_DA_URGENCIA,
  ROTULO_DO_STATUS,
} from '../../domain/ocorrencias';
import { espacos, useTema } from '../../theme';
import type { Ocorrencia } from '../../types';
import { Selo } from '../ui/Selo';

/** Status, urgência e risco imediato lado a lado. */
export function SelosDaOcorrencia({ ocorrencia }: { ocorrencia: Ocorrencia }) {
  const { cores } = useTema();

  return (
    <View style={styles.linha}>
      <Selo
        texto={ROTULO_DO_STATUS[ocorrencia.status]}
        cor={corDoStatus(ocorrencia.status, cores)}
      />
      {ocorrencia.urgencia && (
        <Selo
          texto={`Urgência ${ROTULO_DA_URGENCIA[ocorrencia.urgencia].toLowerCase()}`}
          cor={corDaUrgencia(ocorrencia.urgencia, cores)}
        />
      )}
      {ocorrencia.riscoImediato && (
        <Selo texto="Risco imediato" cor={cores.erro} solido />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', flexWrap: 'wrap', gap: espacos.xs },
});
