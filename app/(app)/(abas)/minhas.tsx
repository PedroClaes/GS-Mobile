import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ListaDeOcorrencias } from '../../../src/components/ocorrencias/ListaDeOcorrencias';
import { BotaoFlutuante } from '../../../src/components/ui/BotaoFlutuante';
import { useMinhasOcorrencias } from '../../../src/hooks/useOcorrencias';
import { criarEstilos } from '../../../src/theme';

/** Ocorrências abertas pelo cidadão logado, para acompanhar o atendimento. */
export default function MinhasScreen() {
  const styles = useEstilos();
  const router = useRouter();
  const consulta = useMinhasOcorrencias();
  const abrirNova = () => router.push('/ocorrencias/nova');

  return (
    <View style={styles.tela}>
      <ListaDeOcorrencias
        consulta={consulta}
        vazio={{
          titulo: 'Você ainda não reportou nada',
          descricao:
            'Viu um buraco, poste apagado ou lixo acumulado? Conte para a cidade.',
          acao: { titulo: 'Reportar um problema', aoPressionar: abrirNova },
        }}
      />
      <BotaoFlutuante titulo="Reportar" aoPressionar={abrirNova} />
    </View>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({ tela: { flex: 1, backgroundColor: cores.fundo } })
);
