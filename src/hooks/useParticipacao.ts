import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { participacaoService } from '../services/participacaoService';
import type { DadosComentario } from '../types';
import { queryKeys } from './queryKeys';

/**
 * O apoio vai para a .NET, que publica um evento no RabbitMQ; a Java consome e
 * recalcula `qtdApoios` e a prioridade. Esse caminho leva alguns segundos, por
 * isso a ocorrência é recarregada depois de um intervalo.
 */
const ATRASO_DO_EVENTO_MS = 4000;

export function useResumoDeApoios(ocorrenciaId: number, habilitado = true) {
  return useQuery({
    queryKey: queryKeys.apoios(ocorrenciaId),
    queryFn: () => participacaoService.resumoDeApoios(ocorrenciaId),
    select: (envelope) => envelope.data,
    enabled: habilitado && Number.isFinite(ocorrenciaId),
  });
}

function useAposMudarApoio() {
  const queryClient = useQueryClient();
  return (ocorrenciaId: number) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.apoios(ocorrenciaId) });
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ocorrencias });
    }, ATRASO_DO_EVENTO_MS);
  };
}

export function useApoiar() {
  const aposMudar = useAposMudarApoio();
  return useMutation({
    mutationFn: (ocorrenciaId: number) => participacaoService.apoiar(ocorrenciaId),
    onSuccess: (_, ocorrenciaId) => aposMudar(ocorrenciaId),
  });
}

export function useRetirarApoio() {
  const aposMudar = useAposMudarApoio();
  return useMutation({
    mutationFn: (ocorrenciaId: number) => participacaoService.retirarApoio(ocorrenciaId),
    onSuccess: (_, ocorrenciaId) => aposMudar(ocorrenciaId),
  });
}

export function useComentarios(ocorrenciaId: number) {
  return useQuery({
    queryKey: queryKeys.comentarios(ocorrenciaId),
    queryFn: () => participacaoService.comentarios(ocorrenciaId),
    select: (pagina) => pagina.itens,
    enabled: Number.isFinite(ocorrenciaId),
  });
}

export function useComentario(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.comentario(id ?? ''),
    queryFn: () => participacaoService.comentario(id as string),
    enabled: Boolean(id),
  });
}

export function useEtiquetas() {
  return useQuery({
    queryKey: queryKeys.etiquetas,
    queryFn: participacaoService.etiquetas,
    select: (envelope) => envelope.data.map((item) => item.data),
    staleTime: 1000 * 60 * 10,
  });
}

export function useComentar(ocorrenciaId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados: DadosComentario) =>
      participacaoService.comentar(ocorrenciaId, dados),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.comentarios(ocorrenciaId) }),
  });
}

export function useEditarComentario(id: string, ocorrenciaId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados: DadosComentario) =>
      participacaoService.editarComentario(id, dados),
    onSuccess: (envelope) => {
      queryClient.setQueryData(queryKeys.comentario(id), envelope);
      if (ocorrenciaId !== undefined) {
        queryClient.invalidateQueries({ queryKey: queryKeys.comentarios(ocorrenciaId) });
      }
    },
  });
}

export function useRemoverComentario(ocorrenciaId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => participacaoService.removerComentario(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.comentario(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.comentarios(ocorrenciaId) });
    },
  });
}
