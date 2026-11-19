import { StyleSheet, Text, View } from 'react-native';

import { ListaDeOcorrencias } from '../../../src/components/ocorrencias/ListaDeOcorrencias';
import { useFilaDoGestor } from '../../../src/hooks/useOcorrencias';
import { criarEstilos, espacos, familias, fontes } from '../../../src/theme';

/**
 * Fila do gestor, já ordenada pela API Java por prioridade: urgência e risco
 * definidos pela IA, somados aos apoios que chegam da API .NET pelo RabbitMQ.
 */
export default function FilaScreen() {
  const styles = useEstilos();
  const consulta = useFilaDoGestor();
  const total = consulta.data?.pages[0]?.totalElementos;

  return (
    <View style={styles.tela}>
      <ListaDeOcorrencias
        consulta={consulta}
        mostrarPrioridade
        cabecalho={
          <Text style={styles.resumo}>
            {total !== undefined ? `${total} ocorrências aguardando atendimento · ` : ''}
            maior prioridade primeiro
          </Text>
        }
        vazio={{
          titulo: 'Fila vazia',
          descricao: 'Nenhuma ocorrência aguardando atendimento.',
        }}
      />
    </View>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: cores.fundo },
    resumo: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
      marginBottom: espacos.md,
    },
  })
);
