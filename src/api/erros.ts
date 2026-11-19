/**
 * Erro único para as duas APIs.
 *
 * A Java responde `{ status, erro, mensagem, campos: [{ campo, mensagem }] }` e
 * a .NET responde ProblemDetails (`{ title, detail, errors: { campo: [...] } }`).
 * As telas não precisam saber de qual API veio a falha: leem `mensagem` e,
 * nos formulários, `campos`.
 */
export class ErroDeApi extends Error {
  constructor(
    mensagem: string,
    /** Código HTTP; 0 quando não houve resposta (sem rede ou tempo esgotado). */
    readonly status: number,
    /** Erros de validação por campo, quando a API os informa. */
    readonly campos: Record<string, string> = {},
    /** Segundos até poder tentar de novo (cabeçalho Retry-After do 429). */
    readonly aguardarSegundos: number | null = null
  ) {
    super(mensagem);
    this.name = 'ErroDeApi';
  }

  /** Falhas que não mudam com uma nova tentativa automática. */
  get definitivo(): boolean {
    return this.status >= 400 && this.status < 500 && this.status !== 408;
  }
}

type CorpoJava = {
  mensagem?: string;
  campos?: { campo: string; mensagem: string }[];
};

type CorpoNet = {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
};

const MENSAGENS_PADRAO: Record<number, string> = {
  400: 'Confira os dados informados.',
  401: 'Sua sessão expirou. Entre novamente.',
  403: 'Você não tem permissão para isso.',
  404: 'Registro não encontrado.',
  409: 'Este registro já existe.',
  422: 'Não foi possível concluir a operação.',
  429: 'Muitas ações seguidas. Aguarde um pouco.',
};

function lerCampos(corpo: CorpoJava & CorpoNet): Record<string, string> {
  const campos: Record<string, string> = {};
  corpo.campos?.forEach(({ campo, mensagem }) => {
    campos[campo] = mensagem;
  });
  Object.entries(corpo.errors ?? {}).forEach(([campo, mensagens]) => {
    // A .NET devolve as chaves em camelCase; a primeira mensagem basta.
    campos[campo.charAt(0).toLowerCase() + campo.slice(1)] = mensagens[0];
  });
  return campos;
}

/** Monta o erro a partir de uma resposta HTTP sem sucesso. */
export function erroDaResposta(
  status: number,
  corpo: unknown,
  retryAfter: string | null
): ErroDeApi {
  const dados = (typeof corpo === 'object' && corpo !== null ? corpo : {}) as CorpoJava &
    CorpoNet;
  const aguardar = retryAfter ? Number.parseInt(retryAfter, 10) : null;

  let mensagem = dados.mensagem ?? dados.detail ?? dados.title;
  if (status === 401) mensagem = dados.mensagem ?? MENSAGENS_PADRAO[401];
  if (status === 429) {
    mensagem = aguardar
      ? `Muitas ações seguidas. Tente de novo em ${aguardar} s.`
      : MENSAGENS_PADRAO[429];
  }
  if (status >= 500)
    mensagem = 'O servidor teve um problema. Tente novamente em instantes.';

  return new ErroDeApi(
    mensagem ?? MENSAGENS_PADRAO[status] ?? 'Não foi possível concluir a operação.',
    status,
    lerCampos(dados),
    Number.isFinite(aguardar) ? aguardar : null
  );
}

export const erroSemResposta = (tempoEsgotado: boolean) =>
  new ErroDeApi(
    tempoEsgotado
      ? 'O servidor demorou para responder. Tente novamente em instantes.'
      : 'Sem conexão com o servidor. Verifique sua internet.',
    0
  );

/** Mensagem pronta para exibir a partir de qualquer erro capturado. */
export function mensagemDoErro(erro: unknown): string {
  if (erro instanceof Error) return erro.message;
  return 'Algo deu errado. Tente novamente.';
}

/** Erros de campo, se o erro for de validação da API. */
export function camposDoErro(erro: unknown): Record<string, string> {
  return erro instanceof ErroDeApi ? erro.campos : {};
}
