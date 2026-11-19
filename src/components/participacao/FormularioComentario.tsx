import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { camposDoErro, mensagemDoErro } from '../../api/erros';
import { validarComentario } from '../../domain/validacao';
import { useEtiquetas } from '../../hooks/useParticipacao';
import { criarEstilos, espacos, familias, fontes } from '../../theme';
import type { DadosComentario } from '../../types';
import { AlertaErro } from '../ui/AlertaErro';
import { Botao } from '../ui/Botao';
import { CampoTexto } from '../ui/CampoTexto';
import { SeletorDeChips } from '../ui/SeletorDeChips';

const MAXIMO_DE_ETIQUETAS = 5;

type Props = {
  valoresIniciais: DadosComentario;
  textoDoBotao: string;
  aoEnviar: (dados: DadosComentario) => Promise<unknown>;
};

/** Texto do comentário e até 5 etiquetas (relação N:N na API .NET). */
export function FormularioComentario({ valoresIniciais, textoDoBotao, aoEnviar }: Props) {
  const styles = useEstilos();
  const etiquetas = useEtiquetas();
  const [texto, setTexto] = useState(valoresIniciais.texto);
  const [selecionadas, setSelecionadas] = useState<string[]>(valoresIniciais.etiquetaIds);
  const [erroTexto, setErroTexto] = useState<string | undefined>();
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function alternarEtiqueta(id: string) {
    setSelecionadas((atuais) => {
      if (atuais.includes(id)) return atuais.filter((atual) => atual !== id);
      if (atuais.length >= MAXIMO_DE_ETIQUETAS) return atuais;
      return [...atuais, id];
    });
  }

  async function enviar() {
    setErroGeral(null);
    const erro = validarComentario(texto);
    setErroTexto(erro);
    if (erro) return;

    setEnviando(true);
    try {
      await aoEnviar({ texto, etiquetaIds: selecionadas });
    } catch (falha) {
      setErroTexto(camposDoErro(falha).texto);
      setErroGeral(mensagemDoErro(falha));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <CampoTexto
        rotulo="Comentário"
        placeholder="Acrescente uma informação útil: desde quando, se piorou, um ponto de referência..."
        value={texto}
        onChangeText={(valor) => {
          setTexto(valor);
          setErroTexto(undefined);
        }}
        multiline
        maxLength={1000}
        erro={erroTexto}
        dica={`${texto.trim().length}/1000`}
        autoFocus
      />

      {(etiquetas.data?.length ?? 0) > 0 && (
        <>
          <Text style={styles.rotulo}>Etiquetas (até {MAXIMO_DE_ETIQUETAS})</Text>
          <SeletorDeChips
            opcoes={(etiquetas.data ?? []).map((e) => ({
              valor: e.id,
              rotulo: `#${e.nome}`,
            }))}
            selecionados={selecionadas}
            aoAlternar={alternarEtiqueta}
          />
        </>
      )}

      <Text style={styles.moderacao}>
        Os comentários passam por moderação automática: ofensas e spam são recusados.
      </Text>

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
    moderacao: {
      color: cores.textoTerciario,
      fontSize: fontes.mini,
      fontFamily: familias.texto,
      marginBottom: espacos.lg,
    },
  })
);
