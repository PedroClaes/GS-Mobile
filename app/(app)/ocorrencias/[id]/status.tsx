import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { mensagemDoErro } from '../../../../src/api/erros';
import { AlertaErro } from '../../../../src/components/ui/AlertaErro';
import { Botao } from '../../../../src/components/ui/Botao';
import { CampoTexto } from '../../../../src/components/ui/CampoTexto';
import { EstadoCarregando, EstadoErro } from '../../../../src/components/ui/Estados';
import { SeletorDeChips } from '../../../../src/components/ui/SeletorDeChips';
import { Tela } from '../../../../src/components/ui/Tela';
import {
  ROTULO_DO_STATUS,
  TRANSICOES_DO_GESTOR,
} from '../../../../src/domain/ocorrencias';
import { useAlterarStatus, useOcorrencia } from '../../../../src/hooks/useOcorrencias';
import { criarEstilos, espacos, familias, fontes } from '../../../../src/theme';
import type { StatusOcorrencia } from '../../../../src/types';

/**
 * Mudança de status pelo gestor. Só aparecem as transições que a API aceita a
 * partir do status atual; a observação vai para a linha do tempo do cidadão.
 */
export default function AtualizarStatusScreen() {
  const styles = useEstilos();
  const router = useRouter();
  const { id: parametro } = useLocalSearchParams<{ id: string }>();
  const id = Number(parametro);
  const ocorrencia = useOcorrencia(id);
  const alterar = useAlterarStatus(id);
  const [novoStatus, setNovoStatus] = useState<StatusOcorrencia | null>(null);
  const [observacao, setObservacao] = useState('');
  const [erroStatus, setErroStatus] = useState<string | undefined>();

  if (ocorrencia.isPending) return <EstadoCarregando />;
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

  const atual = ocorrencia.data.status;
  const opcoes = TRANSICOES_DO_GESTOR[atual].map((status) => ({
    valor: status,
    rotulo: ROTULO_DO_STATUS[status],
  }));

  function salvar() {
    if (!novoStatus) {
      setErroStatus('Escolha o novo status.');
      return;
    }
    alterar.mutate(
      { status: novoStatus, observacao },
      { onSuccess: () => router.back() }
    );
  }

  return (
    <Tela>
      <Text style={styles.titulo}>{ocorrencia.data.titulo}</Text>
      <Text style={styles.atual}>Status atual: {ROTULO_DO_STATUS[atual]}</Text>

      {opcoes.length === 0 ? (
        <EstadoErro mensagem="Esta ocorrência está em um estado final e não pode mais mudar." />
      ) : (
        <>
          <Text style={styles.rotulo}>Novo status</Text>
          <SeletorDeChips
            opcoes={opcoes}
            selecionados={novoStatus ? [novoStatus] : []}
            aoAlternar={(valor) => {
              setNovoStatus(valor);
              setErroStatus(undefined);
            }}
          />
          {!!erroStatus && <Text style={styles.erro}>{erroStatus}</Text>}

          <CampoTexto
            rotulo="Observação para o cidadão (opcional)"
            placeholder="Ex.: Equipe enviada para o local"
            value={observacao}
            onChangeText={setObservacao}
            multiline
            maxLength={500}
            dica={`${observacao.length}/500`}
          />

          <AlertaErro mensagem={alterar.error ? mensagemDoErro(alterar.error) : null} />
          <Botao titulo="Salvar status" onPress={salvar} carregando={alterar.isPending} />
        </>
      )}
    </Tela>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    titulo: { color: cores.texto, fontSize: 18, fontFamily: familias.tituloMedio },
    atual: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
      marginTop: espacos.xs,
      marginBottom: espacos.xl,
    },
    rotulo: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.textoForte,
      marginBottom: espacos.sm,
    },
    erro: {
      color: cores.erro,
      fontSize: fontes.mini,
      fontFamily: familias.textoMedio,
      marginTop: -espacos.sm,
      marginBottom: espacos.lg,
    },
  })
);
