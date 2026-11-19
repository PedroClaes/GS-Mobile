import { randomUUID } from 'expo-crypto';

import { apiNet } from '../api/httpClient';
import type {
  Apoio,
  Comentario,
  DadosComentario,
  Envelope,
  Etiqueta,
  PaginaNet,
  ResumoApoios,
} from '../types';

/**
 * Os POSTs de apoio e comentário na .NET são idempotentes: cada ação do
 * usuário leva uma chave nova. Se a rede cair e a mesma requisição for
 * reenviada com a mesma chave, a API devolve a resposta original em vez de
 * gravar em dobro.
 */
function cabecalhoDeIdempotencia(chave: string = randomUUID()) {
  return { 'Idempotency-Key': chave };
}

/** Apoios, comentários e etiquetas (API .NET, mesmo token da Java). */
export const participacaoService = {
  resumoDeApoios(ocorrenciaId: number) {
    return apiNet.get<Envelope<ResumoApoios>>(`/ocorrencias/${ocorrenciaId}/apoios`);
  },

  apoiar(ocorrenciaId: number) {
    return apiNet.post<Envelope<Apoio>>('/apoios', {
      corpo: { ocorrenciaId },
      cabecalhos: cabecalhoDeIdempotencia(),
    });
  },

  retirarApoio(ocorrenciaId: number) {
    return apiNet.delete(`/apoios/${ocorrenciaId}`);
  },

  comentarios(ocorrenciaId: number) {
    return apiNet.get<PaginaNet<Comentario>>(`/ocorrencias/${ocorrenciaId}/comentarios`, {
      parametros: { pagina: 1, tamanhoPagina: 50, ascendente: true },
    });
  },

  comentario(id: string) {
    return apiNet.get<Envelope<Comentario>>(`/comentarios/${id}`);
  },

  comentar(ocorrenciaId: number, dados: DadosComentario) {
    return apiNet.post<Envelope<Comentario>>('/comentarios', {
      corpo: { ocorrenciaId, texto: dados.texto.trim(), etiquetaIds: dados.etiquetaIds },
      cabecalhos: cabecalhoDeIdempotencia(),
    });
  },

  editarComentario(id: string, dados: DadosComentario) {
    return apiNet.put<Envelope<Comentario>>(`/comentarios/${id}`, {
      corpo: { texto: dados.texto.trim(), etiquetaIds: dados.etiquetaIds },
    });
  },

  removerComentario(id: string) {
    return apiNet.delete(`/comentarios/${id}`);
  },

  etiquetas() {
    return apiNet.get<Envelope<Envelope<Etiqueta>[]>>('/etiquetas');
  },
};

/** O que o usuário pode fazer com o recurso, segundo os links HATEOAS da API. */
export function podeExecutar(links: { rel: string }[], acao: string): boolean {
  return links.some((link) => link.rel === acao);
}
