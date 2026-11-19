import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';

import { ocorrenciasService } from '../services/ocorrenciasService';
import type {
  DadosOcorrencia,
  FiltrosOcorrencias,
  Ocorrencia,
  PaginaJava,
  StatusOcorrencia,
} from '../types';
import { queryKeys } from './queryKeys';

/** Intervalo e limite da consulta enquanto a IA faz a triagem (5 a 30 s no Render). */
const INTERVALO_DA_TRIAGEM_MS = 3000;
const TENTATIVAS_DA_TRIAGEM = 14;

function proximaPagina(ultima: PaginaJava<Ocorrencia>) {
  return ultima.ultima ? undefined : ultima.pagina + 1;
}

/** Junta as páginas carregadas numa lista só, para a FlatList. */
export function achatar(
  dados: InfiniteData<PaginaJava<Ocorrencia>> | undefined
): Ocorrencia[] {
  return dados?.pages.flatMap((pagina) => pagina.conteudo) ?? [];
}

export function useOcorrenciasDaCidade(filtros: FiltrosOcorrencias) {
  return useInfiniteQuery({
    queryKey: queryKeys.listaDaCidade(filtros),
    queryFn: ({ pageParam }) => ocorrenciasService.listar(filtros, pageParam),
    initialPageParam: 0,
    getNextPageParam: proximaPagina,
  });
}

export function useMinhasOcorrencias() {
  return useInfiniteQuery({
    queryKey: queryKeys.minhas,
    queryFn: ({ pageParam }) => ocorrenciasService.minhas(pageParam),
    initialPageParam: 0,
    getNextPageParam: proximaPagina,
  });
}

export function useFilaDoGestor() {
  return useInfiniteQuery({
    queryKey: queryKeys.fila,
    queryFn: ({ pageParam }) => ocorrenciasService.fila(pageParam),
    initialPageParam: 0,
    getNextPageParam: proximaPagina,
  });
}

/**
 * Detalhe da ocorrência. Enquanto o status for EM_TRIAGEM, consulta de novo a
 * cada 3 segundos para mostrar o resultado da IA assim que ele sair.
 */
export function useOcorrencia(id: number) {
  return useQuery({
    queryKey: queryKeys.ocorrencia(id),
    queryFn: () => ocorrenciasService.buscar(id),
    enabled: Number.isFinite(id),
    refetchInterval: (query) =>
      query.state.data?.status === 'EM_TRIAGEM' &&
      query.state.dataUpdateCount < TENTATIVAS_DA_TRIAGEM
        ? INTERVALO_DA_TRIAGEM_MS
        : false,
  });
}

export function useHistorico(id: number) {
  return useQuery({
    queryKey: queryKeys.historico(id),
    queryFn: () => ocorrenciasService.historico(id),
    enabled: Number.isFinite(id),
  });
}

export function useCategorias() {
  return useQuery({
    queryKey: queryKeys.categorias,
    queryFn: ocorrenciasService.categorias,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCriarOcorrencia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados: DadosOcorrencia) => ocorrenciasService.criar(dados),
    onSuccess: (criada) => {
      queryClient.setQueryData(queryKeys.ocorrencia(criada.id), criada);
      queryClient.invalidateQueries({ queryKey: queryKeys.ocorrencias });
    },
  });
}

export function useAtualizarOcorrencia(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados: DadosOcorrencia) => ocorrenciasService.atualizar(id, dados),
    onSuccess: (atualizada) => {
      queryClient.setQueryData(queryKeys.ocorrencia(id), atualizada);
      queryClient.invalidateQueries({ queryKey: queryKeys.ocorrencias });
    },
  });
}

export function useExcluirOcorrencia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ocorrenciasService.excluir(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.ocorrencia(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.ocorrencias });
    },
  });
}

export function useAlterarStatus(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      status,
      observacao,
    }: {
      status: StatusOcorrencia;
      observacao: string;
    }) => ocorrenciasService.alterarStatus(id, status, observacao),
    onSuccess: (atualizada) => {
      queryClient.setQueryData(queryKeys.ocorrencia(id), atualizada);
      queryClient.invalidateQueries({ queryKey: queryKeys.ocorrencias });
    },
  });
}
