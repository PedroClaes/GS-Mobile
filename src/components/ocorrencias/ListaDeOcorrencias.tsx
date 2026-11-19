import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import { mensagemDoErro } from '../../api/erros';
import { achatar } from '../../hooks/useOcorrencias';
import { criarEstilos, espacos, useTema } from '../../theme';
import type { Ocorrencia, PaginaJava } from '../../types';
import { EstadoCarregando, EstadoErro, EstadoVazio } from '../ui/Estados';
import { CartaoOcorrencia } from './CartaoOcorrencia';

type Props = {
  consulta: UseInfiniteQueryResult<InfiniteData<PaginaJava<Ocorrencia>>>;
  vazio: {
    titulo: string;
    descricao?: string;
    acao?: { titulo: string; aoPressionar: () => void };
  };
  cabecalho?: ReactElement;
  mostrarPrioridade?: boolean;
};

/**
 * Lista paginada da API Java com rolagem infinita: pede a próxima página ao
 * chegar perto do fim, enquanto a resposta disser `ultima: false`.
 */
export function ListaDeOcorrencias({
  consulta,
  vazio,
  cabecalho,
  mostrarPrioridade,
}: Props) {
  const { cores } = useTema();
  const styles = useEstilos();
  const router = useRouter();
  const itens = achatar(consulta.data);

  function corpoVazio() {
    if (consulta.isPending)
      return <EstadoCarregando mensagem="Buscando ocorrências..." />;
    if (consulta.isError) {
      return (
        <EstadoErro
          mensagem={mensagemDoErro(consulta.error)}
          aoTentarNovamente={() => consulta.refetch()}
        />
      );
    }
    return <EstadoVazio {...vazio} />;
  }

  return (
    <FlatList
      data={itens}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <CartaoOcorrencia
          ocorrencia={item}
          mostrarPrioridade={mostrarPrioridade}
          aoPressionar={() => router.push(`/ocorrencias/${item.id}`)}
        />
      )}
      ListHeaderComponent={cabecalho}
      ListEmptyComponent={corpoVazio()}
      ListFooterComponent={
        consulta.isFetchingNextPage ? (
          <View style={styles.rodape}>
            <ActivityIndicator color={cores.primaria} />
          </View>
        ) : null
      }
      onEndReached={() => {
        if (consulta.hasNextPage && !consulta.isFetchingNextPage)
          consulta.fetchNextPage();
      }}
      onEndReachedThreshold={0.4}
      refreshControl={
        <RefreshControl
          refreshing={consulta.isRefetching && !consulta.isFetchingNextPage}
          onRefresh={() => consulta.refetch()}
          tintColor={cores.primaria}
          colors={[cores.primaria]}
          progressBackgroundColor={cores.superficie}
        />
      }
      contentContainerStyle={styles.conteudo}
      style={styles.lista}
    />
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    lista: { flex: 1, backgroundColor: cores.fundo },
    conteudo: { padding: espacos.lg, paddingBottom: 96 },
    rodape: { paddingVertical: espacos.lg },
  })
);
