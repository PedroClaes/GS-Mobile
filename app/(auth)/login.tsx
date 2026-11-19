import { Link } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { camposDoErro, mensagemDoErro } from '../../src/api/erros';
import { AlertaErro } from '../../src/components/ui/AlertaErro';
import { Botao } from '../../src/components/ui/Botao';
import { CampoTexto } from '../../src/components/ui/CampoTexto';
import { Tela } from '../../src/components/ui/Tela';
import { useAuth } from '../../src/contexts/AuthContext';
import { semErros, validarLogin } from '../../src/domain/validacao';
import { useDemora } from '../../src/hooks/useDemora';
import { criarEstilos, espacos, familias, fontes, raios } from '../../src/theme';

const ilustracao = require('../../assets/images/ilustracao-cidade.png');
const logo = require('../../assets/images/logo.png');

/** Contas criadas pela API Java para a avaliação (senha123). */
const CONTAS_DE_DEMONSTRACAO = [
  { rotulo: 'Cidadã (Maria)', email: 'maria@consertaai.com' },
  { rotulo: 'Cidadão (João)', email: 'joao@consertaai.com' },
  { rotulo: 'Gestor', email: 'gestor@consertaai.com' },
];

export default function LoginScreen() {
  const styles = useEstilos();
  const { entrar, sessaoExpirou } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [erros, setErros] = useState<{ email?: string; senha?: string }>({});
  const [enviando, setEnviando] = useState(false);
  const demorando = useDemora(enviando);

  async function handleEntrar() {
    setErro(null);
    const encontrados = validarLogin(email, senha);
    setErros(encontrados);
    if (!semErros(encontrados)) return;

    setEnviando(true);
    try {
      await entrar(email, senha);
      // A navegação acontece sozinha: o guard da rota raiz reage à sessão.
    } catch (e) {
      setErros(camposDoErro(e));
      setErro(mensagemDoErro(e));
      setEnviando(false);
    }
  }

  function usarConta(emailDaConta: string) {
    setEmail(emailDaConta);
    setSenha('senha123');
    setErros({});
    setErro(null);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Tela areaSegura style={styles.conteudo}>
        <Image
          source={ilustracao}
          style={styles.ilustracao}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
        <View style={styles.marca}>
          <Image
            source={logo}
            style={styles.logo}
            accessibilityLabel="Logotipo do Conserta Aí"
          />
          <View>
            <Text style={styles.titulo}>Conserta Aí</Text>
            <Text style={styles.subtitulo}>Viu um problema na rua? Avise a cidade.</Text>
          </View>
        </View>

        {sessaoExpirou && (
          <AlertaErro mensagem="Sua sessão expirou. Entre novamente para continuar." />
        )}

        <CampoTexto
          rotulo="E-mail"
          placeholder="voce@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          erro={erros.email}
        />
        <CampoTexto
          rotulo="Senha"
          placeholder="Sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoComplete="password"
          erro={erros.senha}
        />

        <AlertaErro mensagem={erro} />

        <Botao titulo="Entrar" onPress={handleEntrar} carregando={enviando} />
        {demorando && (
          <Text style={styles.aviso}>
            Conectando ao servidor... na primeira vez do dia pode levar até 1 minuto.
          </Text>
        )}

        <View style={styles.rodape}>
          <Text style={styles.rodapeTexto}>Ainda não tem conta? </Text>
          <Link href="/cadastro" style={styles.link}>
            Criar conta
          </Link>
        </View>

        <Text style={styles.demoTitulo}>Contas de demonstração</Text>
        <View style={styles.demoLinha}>
          {CONTAS_DE_DEMONSTRACAO.map((conta) => (
            <TouchableOpacity
              key={conta.email}
              style={styles.demoChip}
              onPress={() => usarConta(conta.email)}
              accessibilityRole="button"
              accessibilityHint="Preenche e-mail e senha"
            >
              <Text style={styles.demoTexto}>{conta.rotulo}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Tela>
    </KeyboardAvoidingView>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: cores.fundo },
    conteudo: { flexGrow: 1, paddingTop: espacos.md },
    ilustracao: {
      width: '100%',
      height: 150,
      borderRadius: raios.lg,
      marginBottom: espacos.xl,
    },
    marca: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: espacos.md,
      marginBottom: espacos.xxl,
    },
    logo: { width: 56, height: 56, borderRadius: raios.md },
    titulo: { color: cores.texto, fontSize: 28, fontFamily: familias.titulo },
    subtitulo: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
    },
    aviso: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
      textAlign: 'center',
      marginTop: espacos.md,
    },
    rodape: { flexDirection: 'row', justifyContent: 'center', marginTop: espacos.xl },
    rodapeTexto: { color: cores.textoSecundario, fontFamily: familias.texto },
    link: { color: cores.primaria, fontFamily: familias.textoNegrito },
    demoTitulo: {
      color: cores.textoTerciario,
      fontSize: fontes.mini,
      fontFamily: familias.textoForte,
      textTransform: 'uppercase',
      letterSpacing: 1,
      textAlign: 'center',
      marginTop: espacos.xxl,
      marginBottom: espacos.sm,
    },
    demoLinha: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: espacos.sm,
    },
    demoChip: {
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: raios.pilula,
      paddingHorizontal: espacos.md,
      paddingVertical: espacos.xs + 2,
    },
    demoTexto: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.textoMedio,
    },
  })
);
