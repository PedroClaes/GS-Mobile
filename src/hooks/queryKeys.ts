import type { FiltrosOcorrencias } from '../types';

/** Chaves do cache do TanStack Query, centralizadas para invalidar sem erro de digitação. */
export const queryKeys = {
  ocorrencias: ['ocorrencias'] as const,
  listaDaCidade: (filtros: FiltrosOcorrencias) =>
    ['ocorrencias', 'cidade', filtros] as const,
  minhas: ['ocorrencias', 'minhas'] as const,
  fila: ['ocorrencias', 'fila'] as const,
  ocorrencia: (id: number) => ['ocorrencias', 'detalhe', id] as const,
  historico: (id: number) => ['ocorrencias', 'historico', id] as const,
  categorias: ['categorias'] as const,
  apoios: (ocorrenciaId: number) => ['apoios', ocorrenciaId] as const,
  comentarios: (ocorrenciaId: number) => ['comentarios', ocorrenciaId] as const,
  comentario: (id: string) => ['comentario', id] as const,
  etiquetas: ['etiquetas'] as const,
};
