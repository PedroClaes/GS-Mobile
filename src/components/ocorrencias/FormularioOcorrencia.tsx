import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { camposDoErro, mensagemDoErro } from '../../api/erros';
import { semErros, validarOcorrencia, type ErrosDeCampo } from '../../domain/validacao';
import { useCategorias } from '../../hooks/useOcorrencias';
import { criarEstilos, espacos, familias, fontes } from '../../theme';
import type { DadosOcorrencia } from '../../types';
import { AlertaErro } from '../ui/AlertaErro';
import { Botao } from '../ui/Botao';
import { CampoTexto } from '../ui/CampoTexto';
import { SeletorDeChips, type OpcaoDeChip } from '../ui/SeletorDeChips';

type Props = {
  valoresIniciais: DadosOcorrencia;
  textoDoBotao: string;
  aoEnviar: (dados: DadosOcorrencia) => Promise<unknown>;
};

/**
 * Formulário de abertura e edição de ocorrência. A categoria é opcional: sem
 * escolha, a IA da API Java decide a categoria durante a triagem.
 */
export function FormularioOcorrencia({ valoresIniciais, textoDoBotao, aoEnviar }: Props) {
  const styles = useEstilos();
  const categorias = useCategorias();
  const [dados, setDados] = useState<DadosOcorrencia>(valoresIniciais);
  const [erros, setErros] = useState<ErrosDeCampo<DadosOcorrencia>>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function alterar<K extends keyof DadosOcorrencia>(campo: K, valor: DadosOcorrencia[K]) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  }

  async function enviar() {
    setErroGeral(null);
    const encontrados = validarOcorrencia(dados);
    setErros(encontrados);
    if (!semErros(encontrados)) return;

    setEnviando(true);
    try {
      await aoEnviar({
        ...dados,
        titulo: dados.titulo.trim(),
        descricao: dados.descricao.trim(),
        endereco: dados.endereco.trim(),
        bairro: dados.bairro.trim(),
      });
    } catch (erro) {
      setErros(camposDoErro(erro) as ErrosDeCampo<DadosOcorrencia>);
      setErroGeral(mensagemDoErro(erro));
    } finally {
      setEnviando(false);
    }
  }

  const opcoesDeCategoria: OpcaoDeChip<number | null>[] = [
    { valor: null, rotulo: '✨ Deixar a IA escolher' },
    ...(categorias.data ?? []).map((c) => ({ valor: c.id, rotulo: c.nome })),
  ];

  return (
    <>
      <CampoTexto
        rotulo="Título"
        placeholder="Ex.: Buraco na frente da escola"
        value={dados.titulo}
        onChangeText={(v) => alterar('titulo', v)}
        maxLength={120}
        erro={erros.titulo}
      />
      <CampoTexto
        rotulo="Descrição"
        placeholder="Conte o que está acontecendo e por que é um problema."
        value={dados.descricao}
        onChangeText={(v) => alterar('descricao', v)}
        multiline
        maxLength={1000}
        erro={erros.descricao}
        dica={`${dados.descricao.trim().length}/1000 · quanto mais detalhes, melhor a triagem`}
      />
      <CampoTexto
        rotulo="Endereço"
        placeholder="Rua e número ou ponto de referência"
        value={dados.endereco}
        onChangeText={(v) => alterar('endereco', v)}
        maxLength={200}
        erro={erros.endereco}
      />
      <CampoTexto
        rotulo="Bairro"
        placeholder="Ex.: Centro"
        value={dados.bairro}
        onChangeText={(v) => alterar('bairro', v)}
        maxLength={80}
        erro={erros.bairro}
      />

      <Text style={styles.rotulo}>Categoria</Text>
      {categorias.isError ? (
        <Text style={styles.aviso}>
          Não foi possível carregar as categorias. A IA vai escolher por você.
        </Text>
      ) : (
        <SeletorDeChips
          opcoes={opcoesDeCategoria}
          selecionados={[dados.categoriaId ?? null]}
          aoAlternar={(valor) => alterar('categoriaId', valor)}
        />
      )}

      <AlertaErro mensagem={erroGeral} />
      <Botao titulo={textoDoBotao} onPress={enviar} carregando={enviando} />
    </>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    rotulo: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      marginBottom: espacos.sm,
      fontFamily: familias.textoForte,
    },
    aviso: {
      color: cores.textoTerciario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
      marginBottom: espacos.lg,
    },
  })
);
