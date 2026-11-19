/**
 * Contratos das duas APIs, no formato em que chegam em JSON.
 * Java: README do GS-Java, seção 9. .NET: README do consertaai-api-dotnet, seção 7.
 */

// ---------- Autenticação (API Java) ----------

export type Papel = 'CIDADAO' | 'GESTOR';

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  papel: Papel;
  bairro: string | null;
};

export type Sessao = {
  token: string;
  /** Instante ISO em que o token deixa de valer (120 minutos após o login). */
  expiraEm: string;
  usuario: Usuario;
};

export type DadosLogin = { email: string; senha: string };

export type DadosCadastro = {
  nome: string;
  email: string;
  senha: string;
  bairro?: string;
};

// ---------- Ocorrências (API Java) ----------

export type StatusOcorrencia =
  'EM_TRIAGEM' | 'ABERTA' | 'EM_ANDAMENTO' | 'RESOLVIDA' | 'CANCELADA';

export type Urgencia = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export type OrigemTriagem = 'IA' | 'REGRAS';

export type Categoria = {
  id: number;
  nome: string;
  descricao: string | null;
  orgaoResponsavel: string;
  prazoSlaDias: number;
  ativa: boolean;
};

export type Ocorrencia = {
  id: number;
  titulo: string;
  descricao: string;
  endereco: string;
  bairro: string;
  latitude: number | null;
  longitude: number | null;
  status: StatusOcorrencia;
  categoria: { id: number; nome: string } | null;
  urgencia: Urgencia | null;
  riscoImediato: boolean | null;
  resumoIa: string | null;
  orgaoSugerido: string | null;
  origemTriagem: OrigemTriagem | null;
  possivelDuplicadaDeId: number | null;
  qtdApoios: number;
  prioridade: number | null;
  /** Data AAAA-MM-DD. */
  prazoAtendimento: string | null;
  autor: { id: number; nome: string };
  criadoEm: string;
  atualizadoEm: string | null;
  triadaEm: string | null;
};

/** Corpo de criação e edição. Sem categoria, a IA escolhe. */
export type DadosOcorrencia = {
  titulo: string;
  descricao: string;
  endereco: string;
  bairro: string;
  latitude?: number | null;
  longitude?: number | null;
  categoriaId?: number | null;
};

export type HistoricoStatus = {
  statusAnterior: StatusOcorrencia | null;
  statusNovo: StatusOcorrencia;
  observacao: string | null;
  responsavel: string;
  data: string;
};

export type PaginaJava<T> = {
  conteudo: T[];
  pagina: number;
  tamanho: number;
  totalElementos: number;
  totalPaginas: number;
  ultima: boolean;
};

export type FiltrosOcorrencias = {
  status?: StatusOcorrencia;
  bairro?: string;
};

// ---------- Participação (API .NET, com HATEOAS) ----------

export type Link = { href: string; rel: string; method: string };

/** Todo recurso da .NET vem envelopado com os links das ações permitidas. */
export type Envelope<T> = { data: T; links: Link[] };

export type PaginaNet<T> = {
  itens: Envelope<T>[];
  totalRegistros: number;
  paginaAtual: number;
  tamanhoPagina: number;
  totalPaginas: number;
  links: Link[];
};

export type ResumoApoios = {
  ocorrenciaId: number;
  totalApoios: number;
  usuarioApoiou: boolean;
};

export type Apoio = {
  id: string;
  ocorrenciaId: number;
  usuarioId: string;
  dataApoio: string;
  totalApoios: number;
};

export type Etiqueta = { id: string; nome: string; descricao: string | null };

export type Comentario = {
  id: string;
  ocorrenciaId: number;
  usuarioId: string;
  texto: string;
  dataCriacao: string;
  dataEdicao: string | null;
  editado: boolean;
  etiquetas: Etiqueta[];
};

export type DadosComentario = { texto: string; etiquetaIds: string[] };
