import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

import { useDemora } from '../../hooks/useDemora';
import { criarEstilos, espacos, familias, fontes, raios, useTema } from '../../theme';
import { Botao } from './Botao';

const ilustracaoVazia = require('../../../assets/images/ilustracao-vazio.png');

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    centro: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: espacos.xxl * 2,
      paddingHorizontal: espacos.lg,
    },
    texto: {
      color: cores.textoSecundario,
      marginTop: espacos.md,
      fontSize: fontes.corpo,
      fontFamily: familias.texto,
      textAlign: 'center',
      lineHeight: 21,
    },
    dica: {
      color: cores.textoTerciario,
      marginTop: espacos.sm,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
      textAlign: 'center',
    },
    icone: { fontSize: 44, marginBottom: espacos.sm },
    ilustracao: { width: 180, height: 135, marginBottom: espacos.md },
    titulo: {
      color: cores.texto,
      fontSize: fontes.secao + 1,
      fontFamily: familias.tituloMedio,
      textAlign: 'center',
    },
    erroCaixa: {
      backgroundColor: cores.superficie,
      borderRadius: raios.md,
      padding: espacos.xl,
      borderLeftWidth: 4,
      borderLeftColor: cores.erro,
      alignItems: 'center',
      marginVertical: espacos.lg,
    },
    botao: { marginTop: espacos.lg, alignSelf: 'stretch' },
  })
);

/**
 * Indicador de carregamento. Se passar de 5 segundos, explica que o servidor
 * gratuito da API pode estar acordando — o que leva até 1 minuto.
 */
export function EstadoCarregando({ mensagem = 'Carregando...' }: { mensagem?: string }) {
  const { cores } = useTema();
  const styles = useEstilos();
  const demorando = useDemora(true);

  return (
    <View
      style={styles.centro}
      accessibilityLabel={mensagem}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator size="large" color={cores.primaria} />
      <Text style={styles.texto}>{mensagem}</Text>
      {demorando && (
        <Text style={styles.dica}>
          O servidor pode estar acordando. Isso leva até 1 minuto na primeira vez.
        </Text>
      )}
    </View>
  );
}

/** Erro de requisição com ação explícita de nova tentativa. */
export function EstadoErro({
  mensagem,
  aoTentarNovamente,
}: {
  mensagem: string;
  aoTentarNovamente?: () => void;
}) {
  const styles = useEstilos();

  return (
    <View style={styles.erroCaixa} accessibilityRole="alert">
      <Text style={styles.icone}>⚠️</Text>
      <Text style={styles.titulo}>Algo deu errado</Text>
      <Text style={styles.texto}>{mensagem}</Text>
      {aoTentarNovamente && (
        <Botao
          titulo="Tentar novamente"
          onPress={aoTentarNovamente}
          variante="secundario"
          style={styles.botao}
        />
      )}
    </View>
  );
}

/** Lista vazia — diferente de "carregando" e de "erro". */
export function EstadoVazio({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao?: string;
  acao?: { titulo: string; aoPressionar: () => void };
}) {
  const styles = useEstilos();

  return (
    <View style={styles.centro}>
      <Image source={ilustracaoVazia} style={styles.ilustracao} resizeMode="contain" />
      <Text style={styles.titulo}>{titulo}</Text>
      {!!descricao && <Text style={styles.texto}>{descricao}</Text>}
      {acao && (
        <Botao titulo={acao.titulo} onPress={acao.aoPressionar} style={styles.botao} />
      )}
    </View>
  );
}
