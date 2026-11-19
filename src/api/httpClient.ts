import { API_JAVA_URL, API_NET_URL, TEMPO_LIMITE_REQUISICAO_MS } from '../config/env';
import { erroDaResposta, erroSemResposta } from './erros';

/**
 * Cliente HTTP (Fetch API) usado pelos serviços. É a única parte do app que
 * monta requisições: URL base, JSON, token, tempo limite e erros padronizados.
 *
 * O token fica em memória (definido pelo AuthContext no login e ao restaurar
 * a sessão), para não ler o SecureStore a cada chamada.
 */
let tokenAtual: string | null = null;
let aoExpirarSessao: (() => void) | null = null;

export function definirToken(token: string | null): void {
  tokenAtual = token;
}

/** Chamado quando uma requisição autenticada volta 401 (token expirado ou inválido). */
export function aoReceberNaoAutorizado(callback: (() => void) | null): void {
  aoExpirarSessao = callback;
}

type Metodo = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Opcoes = {
  corpo?: unknown;
  cabecalhos?: Record<string, string>;
  parametros?: Record<string, string | number | boolean | undefined | null>;
};

function montarUrl(base: string, caminho: string, parametros: Opcoes['parametros']) {
  const query = Object.entries(parametros ?? {})
    .filter(([, valor]) => valor !== undefined && valor !== null && valor !== '')
    .map(
      ([chave, valor]) =>
        `${encodeURIComponent(chave)}=${encodeURIComponent(String(valor))}`
    )
    .join('&');
  return `${base}${caminho}${query ? `?${query}` : ''}`;
}

async function lerCorpo(resposta: Response): Promise<unknown> {
  const texto = await resposta.text();
  if (!texto) return undefined;
  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

async function requisitar<T>(
  base: string,
  metodo: Metodo,
  caminho: string,
  { corpo, cabecalhos, parametros }: Opcoes = {}
): Promise<T> {
  const controle = new AbortController();
  const temporizador = setTimeout(() => controle.abort(), TEMPO_LIMITE_REQUISICAO_MS);
  const tokenEnviado = tokenAtual;

  let resposta: Response;
  try {
    resposta = await fetch(montarUrl(base, caminho, parametros), {
      method: metodo,
      signal: controle.signal,
      headers: {
        Accept: 'application/json',
        ...(corpo !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(tokenEnviado ? { Authorization: `Bearer ${tokenEnviado}` } : {}),
        ...cabecalhos,
      },
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw erroSemResposta(controle.signal.aborted);
  } finally {
    clearTimeout(temporizador);
  }

  const dados = await lerCorpo(resposta);

  if (!resposta.ok) {
    // Só derruba a sessão se a chamada estava autenticada: um 401 no login
    // significa senha errada, não token vencido.
    if (resposta.status === 401 && tokenEnviado) aoExpirarSessao?.();
    throw erroDaResposta(resposta.status, dados, resposta.headers.get('Retry-After'));
  }

  return dados as T;
}

function criarCliente(base: string) {
  return {
    get: <T>(caminho: string, opcoes?: Opcoes) =>
      requisitar<T>(base, 'GET', caminho, opcoes),
    post: <T>(caminho: string, opcoes?: Opcoes) =>
      requisitar<T>(base, 'POST', caminho, opcoes),
    put: <T>(caminho: string, opcoes?: Opcoes) =>
      requisitar<T>(base, 'PUT', caminho, opcoes),
    patch: <T>(caminho: string, opcoes?: Opcoes) =>
      requisitar<T>(base, 'PATCH', caminho, opcoes),
    delete: <T = void>(caminho: string, opcoes?: Opcoes) =>
      requisitar<T>(base, 'DELETE', caminho, opcoes),
  };
}

/** API Java: login, usuários, ocorrências e triagem por IA. */
export const apiJava = criarCliente(API_JAVA_URL);

/** API .NET: apoios, comentários e etiquetas. */
export const apiNet = criarCliente(API_NET_URL);
