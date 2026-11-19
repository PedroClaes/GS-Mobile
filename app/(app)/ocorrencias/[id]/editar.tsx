import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { mensagemDoErro } from '../../../../src/api/erros';
import { FormularioOcorrencia } from '../../../../src/components/ocorrencias/FormularioOcorrencia';
import { EstadoCarregando, EstadoErro } from '../../../../src/components/ui/Estados';
import { Tela } from '../../../../src/components/ui/Tela';
import { useAuth } from '../../../../src/contexts/AuthContext';
import { podeEditar } from '../../../../src/domain/ocorrencias';
import {
  useAtualizarOcorrencia,
  useOcorrencia,
} from '../../../../src/hooks/useOcorrencias';
import { criarEstilos, espacos, familias, fontes } from '../../../../src/theme';

/** Edição pelo autor, enquanto a ocorrência está em análise ou aberta. */
export default function EditarOcorrenciaScreen() {
  const styles = useEstilos();
  const router = useRouter();
  const { usuario } = useAuth();
  const { id: parametro } = useLocalSearchParams<{ id: string }>();
  const id = Number(parametro);
  const ocorrencia = useOcorrencia(id);
  const atualizar = useAtualizarOcorrencia(id);

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

  const dados = ocorrencia.data;
  if (!podeEditar(dados, usuario)) {
    return (
      <Tela>
        <EstadoErro mensagem="Esta ocorrência já está em atendimento e não pode mais ser editada." />
      </Tela>
    );
  }

  return (
    <Tela>
      <Text style={styles.aviso}>
        Ao salvar, a ocorrência pode passar por uma nova triagem da IA.
      </Text>
      <FormularioOcorrencia
        valoresIniciais={{
          titulo: dados.titulo,
          descricao: dados.descricao,
          endereco: dados.endereco,
          bairro: dados.bairro,
          latitude: dados.latitude,
          longitude: dados.longitude,
          categoriaId: dados.categoria?.id ?? null,
        }}
        textoDoBotao="Salvar alterações"
        aoEnviar={async (novos) => {
          await atualizar.mutateAsync(novos);
          router.back();
        }}
      />
    </Tela>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    aviso: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
      marginBottom: espacos.lg,
    },
  })
);
