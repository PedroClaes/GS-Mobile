import { useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { FormularioOcorrencia } from '../../../src/components/ocorrencias/FormularioOcorrencia';
import { Tela } from '../../../src/components/ui/Tela';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useCriarOcorrencia } from '../../../src/hooks/useOcorrencias';
import { criarEstilos, espacos, familias, fontes } from '../../../src/theme';

/**
 * Abertura de ocorrência (CIDADAO). A API Java responde na hora com status
 * EM_TRIAGEM; o app vai direto para o detalhe, que acompanha a triagem da IA.
 */
export default function NovaOcorrenciaScreen() {
  const styles = useEstilos();
  const router = useRouter();
  const { usuario } = useAuth();
  const criar = useCriarOcorrencia();

  return (
    <Tela>
      <Text style={styles.intro}>
        Descreva o problema. A inteligência artificial classifica a categoria, a urgência
        e o órgão responsável, e avisa se alguém já reportou algo parecido.
      </Text>
      <FormularioOcorrencia
        valoresIniciais={{
          titulo: '',
          descricao: '',
          endereco: '',
          bairro: usuario?.bairro ?? '',
          categoriaId: null,
        }}
        textoDoBotao="Enviar ocorrência"
        aoEnviar={async (dados) => {
          const criada = await criar.mutateAsync(dados);
          router.replace(`/ocorrencias/${criada.id}`);
        }}
      />
    </Tela>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    intro: {
      color: cores.textoSecundario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
      lineHeight: 19,
      marginBottom: espacos.xl,
    },
  })
);
