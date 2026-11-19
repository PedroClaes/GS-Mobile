import { useLocalSearchParams, useRouter } from 'expo-router';

import { mensagemDoErro } from '../../../src/api/erros';
import { FormularioComentario } from '../../../src/components/participacao/FormularioComentario';
import { EstadoCarregando, EstadoErro } from '../../../src/components/ui/Estados';
import { Tela } from '../../../src/components/ui/Tela';
import { useComentario, useEditarComentario } from '../../../src/hooks/useParticipacao';
import { podeExecutar } from '../../../src/services/participacaoService';

/** Edição do próprio comentário (PUT /comentarios/{id} na API .NET). */
export default function EditarComentarioScreen() {
  const router = useRouter();
  const { id, ocorrenciaId } = useLocalSearchParams<{
    id: string;
    ocorrenciaId?: string;
  }>();
  const comentario = useComentario(id);
  const editar = useEditarComentario(id, ocorrenciaId ? Number(ocorrenciaId) : undefined);

  if (comentario.isPending)
    return <EstadoCarregando mensagem="Carregando comentário..." />;
  if (comentario.isError) {
    return (
      <Tela>
        <EstadoErro
          mensagem={mensagemDoErro(comentario.error)}
          aoTentarNovamente={() => comentario.refetch()}
        />
      </Tela>
    );
  }

  const { data, links } = comentario.data;
  if (!podeExecutar(links, 'update')) {
    return (
      <Tela>
        <EstadoErro mensagem="Só quem escreveu o comentário pode editá-lo." />
      </Tela>
    );
  }

  return (
    <Tela>
      <FormularioComentario
        valoresIniciais={{
          texto: data.texto,
          etiquetaIds: data.etiquetas.map((e) => e.id),
        }}
        textoDoBotao="Salvar comentário"
        aoEnviar={async (dados) => {
          await editar.mutateAsync(dados);
          router.back();
        }}
      />
    </Tela>
  );
}
