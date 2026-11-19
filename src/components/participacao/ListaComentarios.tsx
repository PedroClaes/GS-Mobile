import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { mensagemDoErro } from '../../api/erros';
import { formatarDataHora } from '../../domain/ocorrencias';
import { useRemoverComentario } from '../../hooks/useParticipacao';
import { podeExecutar } from '../../services/participacaoService';
import { criarEstilos, espacos, familias, fontes, raios, useTema } from '../../theme';
import type { Comentario, Envelope } from '../../types';
import { Selo } from '../ui/Selo';

type Props = {
  ocorrenciaId: number;
  comentarios: Envelope<Comentario>[];
  usuarioId: number | undefined;
  aoEditar: (comentarioId: string) => void;
};

/**
 * Comentários da ocorrência (API .NET). Os botões de editar e excluir não são
 * decididos pelo app: aparecem só quando a API manda o link HATEOAS da ação
 * ("update" para o autor, "delete" para o autor ou o gestor).
 */
export function ListaComentarios({
  ocorrenciaId,
  comentarios,
  usuarioId,
  aoEditar,
}: Props) {
  const { cores } = useTema();
  const styles = useEstilos();
  const remover = useRemoverComentario(ocorrenciaId);

  function confirmarRemocao(id: string) {
    Alert.alert('Excluir comentário', 'Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          remover.mutate(id, {
            onError: (erro) =>
              Alert.alert('Não foi possível excluir', mensagemDoErro(erro)),
          }),
      },
    ]);
  }

  if (comentarios.length === 0) {
    return <Text style={styles.vazio}>Ninguém comentou ainda. Seja o primeiro!</Text>;
  }

  return (
    <View>
      {comentarios.map(({ data: comentario, links }) => {
        const meu = String(usuarioId) === comentario.usuarioId;
        return (
          <View key={comentario.id} style={[styles.item, meu && styles.itemMeu]}>
            <View style={styles.cabecalho}>
              <Text style={styles.autor}>
                {meu ? 'Você' : `Cidadão #${comentario.usuarioId}`}
              </Text>
              <Text style={styles.data}>
                {formatarDataHora(comentario.dataCriacao)}
                {comentario.editado ? ' · editado' : ''}
              </Text>
            </View>
            <Text style={styles.texto}>{comentario.texto}</Text>
            {comentario.etiquetas.length > 0 && (
              <View style={styles.etiquetas}>
                {comentario.etiquetas.map((etiqueta) => (
                  <Selo
                    key={etiqueta.id}
                    texto={`#${etiqueta.nome}`}
                    cor={cores.textoSecundario}
                  />
                ))}
              </View>
            )}
            <View style={styles.acoes}>
              {podeExecutar(links, 'update') && (
                <TouchableOpacity
                  onPress={() => aoEditar(comentario.id)}
                  accessibilityRole="button"
                >
                  <Text style={styles.acao}>Editar</Text>
                </TouchableOpacity>
              )}
              {podeExecutar(links, 'delete') && (
                <TouchableOpacity
                  onPress={() => confirmarRemocao(comentario.id)}
                  accessibilityRole="button"
                  disabled={remover.isPending}
                >
                  <Text style={[styles.acao, styles.acaoPerigo]}>Excluir</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    item: {
      backgroundColor: cores.superficie,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      padding: espacos.md,
      marginBottom: espacos.sm,
      gap: espacos.xs,
    },
    itemMeu: { borderColor: cores.primaria },
    cabecalho: { flexDirection: 'row', justifyContent: 'space-between', gap: espacos.sm },
    autor: {
      color: cores.texto,
      fontSize: fontes.auxiliar,
      fontFamily: familias.textoNegrito,
    },
    data: {
      color: cores.textoTerciario,
      fontSize: fontes.mini,
      fontFamily: familias.texto,
    },
    texto: {
      color: cores.texto,
      fontSize: fontes.corpo,
      fontFamily: familias.texto,
      lineHeight: 21,
    },
    etiquetas: { flexDirection: 'row', flexWrap: 'wrap', gap: espacos.xs },
    acoes: { flexDirection: 'row', justifyContent: 'flex-end', gap: espacos.lg },
    acao: {
      color: cores.primaria,
      fontSize: fontes.auxiliar,
      fontFamily: familias.textoForte,
      paddingVertical: espacos.xs,
    },
    acaoPerigo: { color: cores.erro },
    vazio: {
      color: cores.textoTerciario,
      fontSize: fontes.auxiliar,
      fontFamily: familias.texto,
      marginBottom: espacos.md,
    },
  })
);
