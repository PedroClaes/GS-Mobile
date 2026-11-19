import { useRouter } from 'expo-router';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';

import { Botao } from '../../../src/components/ui/Botao';
import { Secao } from '../../../src/components/ui/Secao';
import { Selo } from '../../../src/components/ui/Selo';
import {
  SeletorSegmentado,
  type OpcaoSegmentada,
} from '../../../src/components/ui/SeletorSegmentado';
import { Tela } from '../../../src/components/ui/Tela';
import { useAuth } from '../../../src/contexts/AuthContext';
import {
  criarEstilos,
  espacos,
  familias,
  fontes,
  raios,
  useTema,
  type PreferenciaDeTema,
} from '../../../src/theme';

const OPCOES_DE_TEMA: OpcaoSegmentada<PreferenciaDeTema>[] = [
  { valor: 'sistema', rotulo: 'Sistema' },
  { valor: 'claro', rotulo: 'Claro' },
  { valor: 'escuro', rotulo: 'Escuro' },
];

/** Dados da sessão, preferência de tema e encerramento da sessão. */
export default function ContaScreen() {
  const styles = useEstilos();
  const router = useRouter();
  const { cores, preferencia, definirPreferencia } = useTema();
  const { usuario, sair } = useAuth();
  const gestor = usuario?.papel === 'GESTOR';

  function confirmarSaida() {
    // Alert com botões não existe na web; lá a saída é direta.
    if (Platform.OS === 'web') {
      sair();
      return;
    }
    Alert.alert('Sair da conta', 'Você precisará entrar novamente para usar o app.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => sair() },
    ]);
  }

  const iniciais = (usuario?.nome ?? '?')
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('');

  return (
    <Tela>
      <View style={styles.cartao}>
        <View style={styles.avatar}>
          <Text style={styles.iniciais}>{iniciais}</Text>
        </View>
        <Text style={styles.nome}>{usuario?.nome}</Text>
        <Text style={styles.email}>{usuario?.email}</Text>
        <View style={styles.selos}>
          <Selo
            texto={gestor ? 'Gestor da prefeitura' : 'Cidadão'}
            cor={gestor ? cores.info : cores.primaria}
          />
          {!!usuario?.bairro && (
            <Selo texto={`📍 ${usuario.bairro}`} cor={cores.textoSecundario} />
          )}
        </View>
      </View>

      <Secao>Aparência</Secao>
      <SeletorSegmentado
        opcoes={OPCOES_DE_TEMA}
        selecionado={preferencia}
        aoSelecionar={definirPreferencia}
      />
      <Text style={styles.dica}>
        Em &quot;Sistema&quot;, o app acompanha o modo do aparelho.
      </Text>

      <Secao>Como funciona</Secao>
      <Text style={styles.paragrafo}>
        {gestor
          ? 'A fila mostra primeiro o que é mais urgente: a IA avalia cada ocorrência e os apoios dos moradores aumentam a prioridade.'
          : 'Você reporta o problema e a IA classifica, estima a urgência e indica o órgão responsável. Se alguém já reportou, apoie a ocorrência existente: isso aumenta a prioridade na fila da prefeitura.'}
      </Text>

      <Botao
        titulo="Sobre o App"
        variante="secundario"
        onPress={() => router.push('/sobre')}
        style={styles.sobre}
      />
      <Botao
        titulo="Sair da conta"
        variante="perigo"
        onPress={confirmarSaida}
        style={styles.sair}
      />
    </Tela>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    cartao: {
      backgroundColor: cores.superficie,
      borderRadius: raios.lg,
      borderWidth: 1,
      borderColor: cores.borda,
      padding: espacos.xl,
      alignItems: 'center',
      marginBottom: espacos.lg,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: cores.primariaSuave,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iniciais: { color: cores.primaria, fontSize: 24, fontFamily: familias.titulo },
    nome: {
      color: cores.texto,
      fontSize: 20,
      fontFamily: familias.tituloMedio,
      marginTop: espacos.sm,
    },
    email: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
    },
    selos: { flexDirection: 'row', gap: espacos.sm, marginTop: espacos.md },
    dica: {
      color: cores.textoTerciario,
      fontSize: fontes.mini,
      fontFamily: familias.texto,
      marginBottom: espacos.lg,
    },
    paragrafo: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
      lineHeight: 20,
    },
    sobre: { marginTop: espacos.xxl },
    sair: { marginTop: espacos.md },
  })
);
