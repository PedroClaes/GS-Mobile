import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { camposDoErro, mensagemDoErro } from '../../src/api/erros';
import { AlertaErro } from '../../src/components/ui/AlertaErro';
import { Botao } from '../../src/components/ui/Botao';
import { Cabecalho } from '../../src/components/ui/Cabecalho';
import { CampoTexto } from '../../src/components/ui/CampoTexto';
import { Tela } from '../../src/components/ui/Tela';
import { useAuth } from '../../src/contexts/AuthContext';
import { semErros, validarCadastro, type ErrosDeCampo } from '../../src/domain/validacao';
import { criarEstilos, espacos, familias } from '../../src/theme';
import type { DadosCadastro } from '../../src/types';

type Formulario = DadosCadastro & { confirmacao: string };

const VAZIO: Formulario = { nome: '', email: '', senha: '', confirmacao: '', bairro: '' };

/** Cadastro de cidadão na API Java; ao concluir, a pessoa já entra no app. */
export default function CadastroScreen() {
  const styles = useEstilos();
  const { cadastrar } = useAuth();
  const [dados, setDados] = useState<Formulario>(VAZIO);
  const [erros, setErros] = useState<ErrosDeCampo<Formulario>>({});
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function alterar(campo: keyof Formulario, valor: string) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  }

  async function handleCadastrar() {
    setErro(null);
    const encontrados = validarCadastro(dados);
    setErros(encontrados);
    if (!semErros(encontrados)) return;

    setEnviando(true);
    try {
      await cadastrar(dados);
    } catch (e) {
      setErros(camposDoErro(e));
      setErro(mensagemDoErro(e));
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Tela areaSegura>
        <Cabecalho
          titulo="Criar conta"
          subtitulo="Cadastre-se para abrir ocorrências, apoiar e comentar as do seu bairro."
        />

        <CampoTexto
          rotulo="Nome"
          placeholder="Como você quer ser chamado"
          value={dados.nome}
          onChangeText={(v) => alterar('nome', v)}
          autoComplete="name"
          maxLength={100}
          erro={erros.nome}
        />
        <CampoTexto
          rotulo="E-mail"
          placeholder="voce@email.com"
          value={dados.email}
          onChangeText={(v) => alterar('email', v)}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          erro={erros.email}
        />
        <CampoTexto
          rotulo="Bairro (opcional)"
          placeholder="Ex.: Centro"
          value={dados.bairro}
          onChangeText={(v) => alterar('bairro', v)}
          maxLength={80}
          erro={erros.bairro}
          dica="Usado para mostrar primeiro o que acontece perto de você."
        />
        <CampoTexto
          rotulo="Senha"
          placeholder="Mínimo de 6 caracteres"
          value={dados.senha}
          onChangeText={(v) => alterar('senha', v)}
          secureTextEntry
          autoComplete="new-password"
          erro={erros.senha}
        />
        <CampoTexto
          rotulo="Confirmar senha"
          placeholder="Repita a senha"
          value={dados.confirmacao}
          onChangeText={(v) => alterar('confirmacao', v)}
          secureTextEntry
          erro={erros.confirmacao}
        />

        <AlertaErro mensagem={erro} />

        <Botao titulo="Criar conta" onPress={handleCadastrar} carregando={enviando} />

        <View style={styles.rodape}>
          <Text style={styles.rodapeTexto}>Já tem conta? </Text>
          <Link href="/login" style={styles.link}>
            Entrar
          </Link>
        </View>
      </Tela>
    </KeyboardAvoidingView>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: cores.fundo },
    rodape: { flexDirection: 'row', justifyContent: 'center', marginTop: espacos.xl },
    rodapeTexto: { color: cores.textoSecundario, fontFamily: familias.texto },
    link: { color: cores.primaria, fontFamily: familias.textoNegrito },
  })
);
