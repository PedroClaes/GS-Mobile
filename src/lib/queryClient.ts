import { QueryClient } from '@tanstack/react-query';

import { ErroDeApi } from '../api/erros';

/**
 * Erros definitivos (sem permissão, não encontrado, dado inválido) não mudam
 * com uma nova tentativa. Falhas de rede e 5xx, sim: essas são repetidas — o
 * caso típico é a API Java acordando no Render.
 */
function devoTentarNovamente(tentativa: number, erro: unknown): boolean {
  if (erro instanceof ErroDeApi && erro.definitivo) return false;
  return tentativa < 2;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 20,
      gcTime: 1000 * 60 * 5,
      retry: devoTentarNovamente,
      retryDelay: (tentativa) => Math.min(1500 * 2 ** tentativa, 8000),
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});
