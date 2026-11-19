import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { formatarDiaMes } from '../../domain/ocorrencias';
import { criarEstilos, espacos, familias, fontes, raios, useTema } from '../../theme';
import type { Ocorrencia } from '../../types';

/**
 * Resultado da triagem feita pela IA generativa na API Java (Spring AI + Groq):
 * categoria, órgão responsável, resumo e prazo. Enquanto a IA trabalha, mostra
 * o andamento — o detalhe consulta a API de novo a cada 3 segundos.
 */
export function PainelTriagem({ ocorrencia }: { ocorrencia: Ocorrencia }) {
  const { cores } = useTema();
  const styles = useEstilos();

  if (ocorrencia.status === 'EM_TRIAGEM') {
    return (
      <View style={styles.painel} accessibilityLiveRegion="polite">
        <View style={styles.linha}>
          <ActivityIndicator color={cores.ia} />
          <Text style={styles.titulo}>Analisando sua ocorrência...</Text>
        </View>
        <Text style={styles.texto}>
          A IA está classificando o problema, estimando a urgência e indicando o órgão
          responsável. Leva de 5 a 30 segundos.
        </Text>
      </View>
    );
  }

  const porIa = ocorrencia.origemTriagem === 'IA';

  return (
    <View style={styles.painel}>
      <Text style={styles.titulo}>
        {porIa ? '✨ Classificado por IA' : '📋 Classificado por regras'}
      </Text>
      {!!ocorrencia.resumoIa && <Text style={styles.resumo}>{ocorrencia.resumoIa}</Text>}

      <View style={styles.grade}>
        <Info rotulo="Categoria" valor={ocorrencia.categoria?.nome ?? '—'} />
        <Info rotulo="Órgão responsável" valor={ocorrencia.orgaoSugerido ?? '—'} />
        <Info
          rotulo="Prioridade"
          valor={ocorrencia.prioridade != null ? `${ocorrencia.prioridade}/100` : '—'}
        />
        <Info
          rotulo="Prazo de atendimento"
          valor={formatarDiaMes(ocorrencia.prazoAtendimento)}
        />
      </View>
    </View>
  );
}

function Info({ rotulo, valor }: { rotulo: string; valor: string }) {
  const styles = useEstilos();
  return (
    <View style={styles.info}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    painel: {
      backgroundColor: cores.iaSuave,
      borderColor: cores.ia,
      borderWidth: 1,
      borderRadius: raios.lg,
      padding: espacos.lg,
      marginBottom: espacos.lg,
      gap: espacos.sm,
    },
    linha: { flexDirection: 'row', alignItems: 'center', gap: espacos.sm },
    titulo: { color: cores.ia, fontSize: fontes.corpo, fontFamily: familias.tituloMedio },
    texto: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
      lineHeight: 19,
    },
    resumo: {
      color: cores.texto,
      fontSize: fontes.corpo,
      fontFamily: familias.textoMedio,
      lineHeight: 21,
    },
    grade: { flexDirection: 'row', flexWrap: 'wrap', marginTop: espacos.xs },
    info: { width: '50%', paddingVertical: espacos.xs, paddingRight: espacos.sm },
    rotulo: {
      color: cores.textoSecundario,
      fontSize: fontes.mini,
      fontFamily: familias.texto,
    },
    valor: {
      color: cores.texto,
      fontSize: fontes.auxiliar,
      fontFamily: familias.textoForte,
    },
  })
);
