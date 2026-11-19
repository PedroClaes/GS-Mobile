import { useLocalSearchParams, useRouter } from 'expo-router';

import { FormularioComentario } from '../../../src/components/participacao/FormularioComentario';
import { Tela } from '../../../src/components/ui/Tela';
import { useComentar } from '../../../src/hooks/useParticipacao';

/** Novo comentário numa ocorrência (POST /comentarios na API .NET). */
export default function NovoComentarioScreen() {
  const router = useRouter();
  const { ocorrenciaId } = useLocalSearchParams<{ ocorrenciaId: string }>();
  const comentar = useComentar(Number(ocorrenciaId));

  return (
    <Tela>
      <FormularioComentario
        valoresIniciais={{ texto: '', etiquetaIds: [] }}
        textoDoBotao="Publicar comentário"
        aoEnviar={async (dados) => {
          await comentar.mutateAsync(dados);
          router.back();
        }}
      />
    </Tela>
  );
}
