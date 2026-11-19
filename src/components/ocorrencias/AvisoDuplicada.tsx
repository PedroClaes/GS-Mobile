import { StyleSheet, Text, View } from 'react-native';

import { criarEstilos, espacos, familias, fontes, raios } from '../../theme';
import { AlertaErro } from '../ui/AlertaErro';
import { Botao } from '../ui/Botao';

type Props = {
  duplicadaDeId: number;
  aoVer: () => void;
  aoApoiarExistente: () => void;
  apoiando: boolean;
  erro: string | null;
};

/**
 * A IA comparou a ocorrência nova com as abertas e achou uma parecida. Em vez
 * de duas ocorrências do mesmo buraco, o cidadão apoia a que já existe (API
 * .NET), e a prioridade dela sobe na fila do gestor.
 */
export function AvisoDuplicada({
  duplicadaDeId,
  aoVer,
  aoApoiarExistente,
  apoiando,
  erro,
}: Props) {
  const styles = useEstilos();

  return (
    <View style={styles.aviso} accessibilityRole="alert">
      <Text style={styles.titulo}>Parece que alguém já reportou isso</Text>
      <Text style={styles.texto}>
        A ocorrência #{duplicadaDeId} descreve um problema parecido. Apoiar a existente
        aumenta a prioridade dela e evita que a prefeitura receba o mesmo pedido duas
        vezes.
      </Text>
      <AlertaErro mensagem={erro} />
      <Botao
        titulo={`👍 Apoiar a #${duplicadaDeId} e remover a minha`}
        onPress={aoApoiarExistente}
        carregando={apoiando}
      />
      <Botao
        titulo={`Ver a ocorrência #${duplicadaDeId}`}
        variante="secundario"
        onPress={aoVer}
        style={styles.ver}
      />
    </View>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    aviso: {
      backgroundColor: cores.primariaSuave,
      borderColor: cores.primaria,
      borderWidth: 1,
      borderRadius: raios.lg,
      padding: espacos.lg,
      marginBottom: espacos.lg,
      gap: espacos.sm,
    },
    titulo: {
      color: cores.primaria,
      fontSize: fontes.corpo + 1,
      fontFamily: familias.tituloMedio,
    },
    texto: {
      color: cores.texto,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
      lineHeight: 19,
      marginBottom: espacos.sm,
    },
    ver: { marginTop: espacos.xs },
  })
);
