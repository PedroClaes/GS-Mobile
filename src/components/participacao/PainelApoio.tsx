import { StyleSheet, Text, View } from 'react-native';

import { mensagemDoErro } from '../../api/erros';
import {
  useApoiar,
  useResumoDeApoios,
  useRetirarApoio,
} from '../../hooks/useParticipacao';
import { criarEstilos, espacos, familias, fontes, raios } from '../../theme';
import { AlertaErro } from '../ui/AlertaErro';
import { Botao } from '../ui/Botao';

type Props = {
  ocorrenciaId: number;
  /** Só cidadãos que não são o autor podem apoiar. */
  podeApoiar: boolean;
};

/**
 * Apoio à ocorrência (API .NET). Em vez de abrir um report repetido, o cidadão
 * soma o apoio à ocorrência existente, o que aumenta a prioridade na fila.
 */
export function PainelApoio({ ocorrenciaId, podeApoiar }: Props) {
  const styles = useEstilos();
  const resumo = useResumoDeApoios(ocorrenciaId);
  const apoiar = useApoiar();
  const retirar = useRetirarApoio();

  const total = resumo.data?.totalApoios;
  const apoiou = resumo.data?.usuarioApoiou ?? false;
  const erro = apoiar.error ?? retirar.error;
  const ocupado = apoiar.isPending || retirar.isPending;

  return (
    <View style={styles.painel}>
      <View style={styles.contador}>
        <Text style={styles.numero}>{total ?? '—'}</Text>
        <Text style={styles.legenda}>
          {total === 1 ? 'pessoa apoia' : 'pessoas apoiam'}
          {'\n'}esta ocorrência
        </Text>
      </View>

      {resumo.isError && (
        <Text style={styles.indisponivel}>Apoios indisponíveis no momento.</Text>
      )}

      {podeApoiar && resumo.isSuccess && (
        <Botao
          titulo={apoiou ? 'Retirar apoio' : '👍 Apoiar'}
          variante={apoiou ? 'secundario' : 'primario'}
          carregando={ocupado}
          onPress={() => (apoiou ? retirar : apoiar).mutate(ocorrenciaId)}
          style={styles.botao}
        />
      )}
      {erro && (
        <View style={styles.erro}>
          <AlertaErro mensagem={mensagemDoErro(erro)} />
        </View>
      )}
    </View>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    painel: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: cores.superficie,
      borderRadius: raios.lg,
      borderWidth: 1,
      borderColor: cores.borda,
      padding: espacos.lg,
      marginBottom: espacos.lg,
      gap: espacos.md,
    },
    contador: { flexDirection: 'row', alignItems: 'center', gap: espacos.md },
    numero: { color: cores.primaria, fontSize: 34, fontFamily: familias.titulo },
    legenda: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
    },
    botao: { minWidth: 140 },
    indisponivel: {
      color: cores.textoTerciario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
    },
    erro: { width: '100%' },
  })
);
