import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';

import { mensagemDoErro } from '../../../../src/api/erros';
import { AvisoDuplicada } from '../../../../src/components/ocorrencias/AvisoDuplicada';
import { LinhaDoTempo } from '../../../../src/components/ocorrencias/LinhaDoTempo';
import { PainelTriagem } from '../../../../src/components/ocorrencias/PainelTriagem';
import { SelosDaOcorrencia } from '../../../../src/components/ocorrencias/SelosDaOcorrencia';
import { ListaComentarios } from '../../../../src/components/participacao/ListaComentarios';
import { PainelApoio } from '../../../../src/components/participacao/PainelApoio';
import { Botao } from '../../../../src/components/ui/Botao';
import { EstadoCarregando, EstadoErro } from '../../../../src/components/ui/Estados';
import { Secao } from '../../../../src/components/ui/Secao';
import { Tela } from '../../../../src/components/ui/Tela';
import { useAuth } from '../../../../src/contexts/AuthContext';
import {
  ehAutor,
  formatarDataHora,
  podeApoiar,
  podeEditar,
  podeExcluir,
  TRANSICOES_DO_GESTOR,
} from '../../../../src/domain/ocorrencias';
import {
  useExcluirOcorrencia,
  useHistorico,
  useOcorrencia,
} from '../../../../src/hooks/useOcorrencias';
import { useApoiar, useComentarios } from '../../../../src/hooks/useParticipacao';
import { criarEstilos, espacos, familias, fontes } from '../../../../src/theme';

/** Pergunta antes de uma ação destrutiva (na web, onde o Alert não tem botões, usa o confirm). */
function confirmar(titulo: string, mensagem: string, aoConfirmar: () => void) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${titulo}\n\n${mensagem}`)) aoConfirmar();
    return;
  }
  Alert.alert(titulo, mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Confirmar', style: 'destructive', onPress: aoConfirmar },
  ]);
}

/**
 * Detalhe da ocorrência. Reúne as duas APIs: os dados, a triagem da IA e o
 * histórico vêm da Java; apoios e comentários, da .NET — com o mesmo token.
 */
export default function DetalheDaOcorrenciaScreen() {
  const styles = useEstilos();
  const router = useRouter();
  const { usuario } = useAuth();
  const { id: parametro } = useLocalSearchParams<{ id: string }>();
  const id = Number(parametro);

  const ocorrencia = useOcorrencia(id);
  const historico = useHistorico(id);
  const comentarios = useComentarios(id);
  const excluir = useExcluirOcorrencia();
  const apoiarExistente = useApoiar();
  const [erroDuplicada, setErroDuplicada] = useState<string | null>(null);

  // Quando a triagem termina ou o gestor muda o status, o histórico muda junto.
  const status = ocorrencia.data?.status;
  const recarregarHistorico = historico.refetch;
  useEffect(() => {
    if (status) recarregarHistorico();
  }, [status, recarregarHistorico]);

  if (ocorrencia.isPending)
    return <EstadoCarregando mensagem="Carregando ocorrência..." />;
  if (ocorrencia.isError) {
    return (
      <Tela>
        <EstadoErro
          mensagem={mensagemDoErro(ocorrencia.error)}
          aoTentarNovamente={() => ocorrencia.refetch()}
        />
      </Tela>
    );
  }

  const dados = ocorrencia.data;
  const gestor = usuario?.papel === 'GESTOR';
  const transicoes = TRANSICOES_DO_GESTOR[dados.status];
  const mostrarDuplicada =
    dados.possivelDuplicadaDeId !== null &&
    ehAutor(dados, usuario) &&
    podeEditar(dados, usuario);

  function excluirOcorrencia() {
    confirmar(
      'Excluir ocorrência',
      'Ela some da lista da cidade e da fila da prefeitura.',
      () =>
        excluir.mutate(id, {
          onSuccess: () => router.back(),
          onError: (erro) =>
            Alert.alert('Não foi possível excluir', mensagemDoErro(erro)),
        })
    );
  }

  async function apoiarAExistente(existenteId: number) {
    setErroDuplicada(null);
    try {
      await apoiarExistente.mutateAsync(existenteId);
      await excluir.mutateAsync(id);
      router.replace(`/ocorrencias/${existenteId}`);
    } catch (erro) {
      setErroDuplicada(mensagemDoErro(erro));
    }
  }

  return (
    <Tela aoAtualizar={() => ocorrencia.refetch()} atualizando={ocorrencia.isRefetching}>
      <Text style={styles.categoria}>
        #{dados.id} · {dados.categoria?.nome ?? 'Aguardando classificação'}
      </Text>
      <Text style={styles.titulo}>{dados.titulo}</Text>
      <SelosDaOcorrencia ocorrencia={dados} />
      <Text style={styles.local}>
        📍 {dados.endereco} · {dados.bairro}
      </Text>
      <Text style={styles.meta}>
        Reportada por {ehAutor(dados, usuario) ? 'você' : dados.autor.nome} em{' '}
        {formatarDataHora(dados.criadoEm)}
      </Text>

      <PainelTriagem ocorrencia={dados} />

      {mostrarDuplicada && dados.possivelDuplicadaDeId !== null && (
        <AvisoDuplicada
          duplicadaDeId={dados.possivelDuplicadaDeId}
          aoVer={() => router.push(`/ocorrencias/${dados.possivelDuplicadaDeId}`)}
          aoApoiarExistente={() =>
            apoiarAExistente(dados.possivelDuplicadaDeId as number)
          }
          apoiando={apoiarExistente.isPending || excluir.isPending}
          erro={erroDuplicada}
        />
      )}

      <Secao>Descrição</Secao>
      <Text style={styles.descricao}>{dados.descricao}</Text>

      <PainelApoio ocorrenciaId={id} podeApoiar={podeApoiar(dados, usuario)} />

      {(podeEditar(dados, usuario) ||
        podeExcluir(dados, usuario) ||
        (gestor && transicoes.length > 0)) && (
        <View style={styles.acoes}>
          {gestor && transicoes.length > 0 && (
            <Botao
              titulo="Atualizar status"
              onPress={() => router.push(`/ocorrencias/${id}/status`)}
            />
          )}
          {podeEditar(dados, usuario) && (
            <Botao
              titulo="Editar ocorrência"
              variante="secundario"
              onPress={() => router.push(`/ocorrencias/${id}/editar`)}
            />
          )}
          {podeExcluir(dados, usuario) && (
            <Botao
              titulo="Excluir ocorrência"
              variante="perigo"
              onPress={excluirOcorrencia}
              carregando={excluir.isPending && !apoiarExistente.isPending}
            />
          )}
        </View>
      )}

      <Secao>Linha do tempo</Secao>
      {historico.isError ? (
        <Text style={styles.indisponivel}>Histórico indisponível no momento.</Text>
      ) : (
        <LinhaDoTempo historico={historico.data ?? []} />
      )}

      <View style={styles.cabecalhoComentarios}>
        <Secao>{`Comentários${comentarios.data ? ` (${comentarios.data.length})` : ''}`}</Secao>
      </View>
      {comentarios.isPending && (
        <Text style={styles.indisponivel}>Carregando comentários...</Text>
      )}
      {comentarios.isError && (
        <EstadoErro
          mensagem={mensagemDoErro(comentarios.error)}
          aoTentarNovamente={() => comentarios.refetch()}
        />
      )}
      {comentarios.isSuccess && (
        <ListaComentarios
          ocorrenciaId={id}
          comentarios={comentarios.data}
          usuarioId={usuario?.id}
          aoEditar={(comentarioId) =>
            router.push({
              pathname: '/comentarios/[id]',
              params: { id: comentarioId, ocorrenciaId: id },
            })
          }
        />
      )}
      <Botao
        titulo="💬 Comentar"
        variante="secundario"
        onPress={() =>
          router.push({ pathname: '/comentarios/novo', params: { ocorrenciaId: id } })
        }
        style={styles.comentar}
      />
    </Tela>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    categoria: {
      color: cores.primaria,
      fontSize: fontes.mini,
      fontFamily: familias.textoNegrito,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    titulo: {
      color: cores.texto,
      fontSize: 22,
      fontFamily: familias.titulo,
      marginTop: espacos.xs,
      marginBottom: espacos.sm,
    },
    local: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.textoMedio,
      marginTop: espacos.md,
    },
    meta: {
      color: cores.textoTerciario,
      fontSize: fontes.mini,
      fontFamily: familias.texto,
      marginTop: espacos.xs,
      marginBottom: espacos.lg,
    },
    descricao: {
      color: cores.texto,
      fontSize: fontes.corpo,
      fontFamily: familias.texto,
      lineHeight: 22,
      marginBottom: espacos.lg,
    },
    acoes: { gap: espacos.sm, marginBottom: espacos.lg },
    indisponivel: {
      color: cores.textoTerciario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
      marginBottom: espacos.lg,
    },
    cabecalhoComentarios: { marginTop: espacos.sm },
    comentar: { marginTop: espacos.sm },
  })
);
