import { apiJava } from '../api/httpClient';
import type {
  Categoria,
  DadosOcorrencia,
  FiltrosOcorrencias,
  HistoricoStatus,
  Ocorrencia,
  PaginaJava,
  StatusOcorrencia,
} from '../types';

export const TAMANHO_DA_PAGINA = 10;

/** Ocorrências, categorias e fila do gestor (API Java). */
export const ocorrenciasService = {
  /** Lista pública da cidade, mais recentes primeiro. */
  listar(filtros: FiltrosOcorrencias, pagina: number) {
    return apiJava.get<PaginaJava<Ocorrencia>>('/ocorrencias', {
      parametros: { ...filtros, page: pagina, size: TAMANHO_DA_PAGINA },
    });
  },

  minhas(pagina: number) {
    return apiJava.get<PaginaJava<Ocorrencia>>('/ocorrencias/minhas', {
      parametros: { page: pagina, size: TAMANHO_DA_PAGINA },
    });
  },

  /** Fila do gestor, já ordenada por prioridade. */
  fila(pagina: number) {
    return apiJava.get<PaginaJava<Ocorrencia>>('/ocorrencias/fila', {
      parametros: { page: pagina, size: 20 },
    });
  },

  buscar(id: number) {
    return apiJava.get<Ocorrencia>(`/ocorrencias/${id}`);
  },

  historico(id: number) {
    return apiJava.get<HistoricoStatus[]>(`/ocorrencias/${id}/historico`);
  },

  /** Volta com status EM_TRIAGEM; a IA classifica em segundo plano. */
  criar(dados: DadosOcorrencia) {
    return apiJava.post<Ocorrencia>('/ocorrencias', { corpo: dados });
  },

  atualizar(id: number, dados: DadosOcorrencia) {
    return apiJava.put<Ocorrencia>(`/ocorrencias/${id}`, { corpo: dados });
  },

  excluir(id: number) {
    return apiJava.delete(`/ocorrencias/${id}`);
  },

  alterarStatus(id: number, status: StatusOcorrencia, observacao: string) {
    return apiJava.patch<Ocorrencia>(`/ocorrencias/${id}/status`, {
      corpo: { status, observacao: observacao.trim() || null },
    });
  },

  categorias() {
    return apiJava.get<Categoria[]>('/categorias');
  },
};
