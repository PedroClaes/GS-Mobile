import { Image, StyleSheet, Text, View } from 'react-native';

import { Secao } from '../../src/components/ui/Secao';
import { Tela } from '../../src/components/ui/Tela';
import { API_JAVA_URL, API_NET_URL } from '../../src/config/env';
import { INFO_DA_VERSAO } from '../../src/config/versao';
import { criarEstilos, espacos, familias, fontes, raios } from '../../src/theme';

const logo = require('../../assets/images/logo.png');

const INTEGRANTES = [
  { nome: 'Pedro Gabriel Claes Ferreira', rm: 'RM566058' },
  { nome: 'Matheus Arazin de Oliveira', rm: 'RM556649' },
  { nome: 'Artur Pioli Silva', rm: 'RM565597' },
  { nome: 'Kevin Martins Campos', rm: 'RM563454' },
];

const TECNOLOGIAS = [
  'React Native + Expo SDK 56',
  'Expo Router',
  'TanStack Query',
  'Fetch API',
  'expo-secure-store',
  'API Java (Spring Boot + Spring AI)',
  'API .NET (Minimal API)',
];

function formatarData(data: Date): string {
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Identificação da versão instalada, vinculada ao commit que a gerou. */
export default function SobreScreen() {
  const styles = useEstilos();
  const info = INFO_DA_VERSAO;

  return (
    <Tela>
      <View style={styles.marca}>
        <Image
          source={logo}
          style={styles.logo}
          accessibilityLabel="Logotipo do Conserta Aí"
        />
        <Text style={styles.nomeApp}>Conserta Aí</Text>
        <Text style={styles.slogan}>Zeladoria urbana com participação cidadã</Text>
      </View>

      <Secao>Versão publicada</Secao>
      <View style={styles.commitCartao}>
        <Text style={styles.commitRotulo}>Commit de referência</Text>
        <Text style={styles.commitCurto} selectable>
          {info.commitCurto}
        </Text>
        <Text style={styles.commitCompleto} selectable>
          {info.commit}
        </Text>
        {info.alteracoesNaoCommitadas && (
          <Text style={styles.aviso}>
            ⚠️ Gerada com alterações locais não commitadas.
          </Text>
        )}
      </View>

      <View style={styles.linha}>
        <Text style={styles.rotulo}>Versão</Text>
        <Text style={styles.valor}>{info.versao}</Text>
      </View>
      <View style={styles.linha}>
        <Text style={styles.rotulo}>Build</Text>
        <Text style={styles.valor}>{info.build}</Text>
      </View>
      <View style={styles.linha}>
        <Text style={styles.rotulo}>Perfil</Text>
        <Text style={styles.valor}>{info.perfil}</Text>
      </View>
      {info.geradoEm && (
        <View style={styles.linha}>
          <Text style={styles.rotulo}>Gerada em</Text>
          <Text style={styles.valor}>{formatarData(info.geradoEm)}</Text>
        </View>
      )}
      <View style={styles.linha}>
        <Text style={styles.rotulo}>Pacote</Text>
        <Text style={styles.valor}>{info.pacote}</Text>
      </View>

      <Secao>Sobre o projeto</Secao>
      <Text style={styles.paragrafo}>
        Global Solution 2026/2 (CitizenTech) — FIAP. O morador reporta problemas de
        zeladoria (buraco, poste apagado, lixo) e acompanha o atendimento; a IA classifica
        e prioriza cada ocorrência e os apoios dos vizinhos aumentam a prioridade na fila
        da prefeitura.
      </Text>

      <Secao>Equipe</Secao>
      {INTEGRANTES.map((integrante) => (
        <View key={integrante.rm} style={styles.linha}>
          <Text style={styles.valorEsquerda}>{integrante.nome}</Text>
          <Text style={styles.rotulo}>{integrante.rm}</Text>
        </View>
      ))}

      <Secao>Tecnologias</Secao>
      <Text style={styles.paragrafo}>{TECNOLOGIAS.join(' • ')}</Text>

      <Secao>Servidores</Secao>
      <View style={styles.linha}>
        <Text style={styles.rotulo}>API Java</Text>
        <Text style={styles.valorPequeno} selectable>
          {API_JAVA_URL.replace(/^https?:\/\//, '')}
        </Text>
      </View>
      <View style={styles.linha}>
        <Text style={styles.rotulo}>API .NET</Text>
        <Text style={styles.valorPequeno} selectable>
          {API_NET_URL.replace(/^https?:\/\//, '')}
        </Text>
      </View>
    </Tela>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    marca: { alignItems: 'center', marginBottom: espacos.xl },
    logo: { width: 72, height: 72, borderRadius: raios.lg, marginBottom: espacos.sm },
    nomeApp: { color: cores.texto, fontSize: 24, fontFamily: familias.titulo },
    slogan: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
    },
    commitCartao: {
      backgroundColor: cores.superficie,
      borderRadius: raios.lg,
      borderWidth: 1,
      borderColor: cores.primaria,
      padding: espacos.lg,
      alignItems: 'center',
      marginBottom: espacos.md,
    },
    commitRotulo: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
    },
    commitCurto: {
      color: cores.primaria,
      fontSize: 30,
      fontFamily: familias.titulo,
      fontVariant: ['tabular-nums'],
      marginVertical: espacos.xs,
    },
    commitCompleto: {
      color: cores.textoSecundario,
      fontSize: fontes.mini,
      fontFamily: 'monospace',
      textAlign: 'center',
    },
    aviso: {
      color: cores.alerta,
      fontSize: fontes.mini,
      fontFamily: familias.textoMedio,
      marginTop: espacos.sm,
    },
    linha: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: cores.superficie,
      borderRadius: raios.md,
      paddingVertical: espacos.md,
      paddingHorizontal: espacos.lg,
      marginBottom: espacos.sm,
    },
    rotulo: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
    },
    valor: {
      color: cores.texto,
      fontSize: fontes.auxiliar,
      fontFamily: familias.textoForte,
    },
    valorPequeno: {
      color: cores.texto,
      fontSize: fontes.mini,
      fontFamily: familias.textoMedio,
      maxWidth: '68%',
      textAlign: 'right',
    },
    valorEsquerda: {
      color: cores.texto,
      fontSize: fontes.auxiliar,
      fontFamily: familias.textoMedio,
      flex: 1,
    },
    paragrafo: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
      lineHeight: 20,
      marginBottom: espacos.lg,
    },
  })
);
