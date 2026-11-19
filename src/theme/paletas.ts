/**
 * Paletas de cores do Conserta Aí.
 *
 * A identidade parte da sinalização urbana: o laranja do cone de obra como cor
 * principal e o cinza-azulado do asfalto como base. As duas paletas têm as
 * mesmas chaves, então as telas pedem a cor pelo papel (`fundo`, `erro`...) e
 * nunca pelo valor — trocar o tema não exige mudar nenhum componente.
 */
export type Cores = {
  fundo: string;
  superficie: string;
  superficieAlta: string;
  primaria: string;
  /** Fundo translúcido para chips e seleções na cor primária. */
  primariaSuave: string;
  /** Texto exibido sobre botões preenchidos (primário e perigo). */
  textoSobrePrimaria: string;
  texto: string;
  textoSecundario: string;
  textoTerciario: string;
  borda: string;
  sucesso: string;
  alerta: string;
  erro: string;
  /** Fundo translúcido para caixas de erro. */
  erroSuave: string;
  info: string;
  /** Destaque das informações geradas pela IA. */
  ia: string;
  iaSuave: string;
};

export type EsquemaDeCor = 'claro' | 'escuro';

export const paletaEscura: Cores = {
  fundo: '#0F172A',
  superficie: '#1E293B',
  superficieAlta: '#273449',
  primaria: '#F97316',
  primariaSuave: '#F9731626',
  textoSobrePrimaria: '#FFFFFF',
  texto: '#F8FAFC',
  textoSecundario: '#94A3B8',
  textoTerciario: '#64748B',
  borda: '#334155',
  sucesso: '#22C55E',
  alerta: '#EAB308',
  erro: '#EF4444',
  erroSuave: '#EF444422',
  info: '#38BDF8',
  ia: '#A78BFA',
  iaSuave: '#A78BFA22',
};

/** Versão clara: tons mais escuros para manter contraste sobre o branco. */
export const paletaClara: Cores = {
  fundo: '#F8FAFC',
  superficie: '#FFFFFF',
  superficieAlta: '#EEF2F7',
  primaria: '#EA580C',
  primariaSuave: '#EA580C1A',
  textoSobrePrimaria: '#FFFFFF',
  texto: '#0F172A',
  textoSecundario: '#475569',
  textoTerciario: '#94A3B8',
  borda: '#E2E8F0',
  sucesso: '#15803D',
  alerta: '#A16207',
  erro: '#DC2626',
  erroSuave: '#DC26261A',
  info: '#0369A1',
  ia: '#7C3AED',
  iaSuave: '#7C3AED14',
};

export const paletas: Record<EsquemaDeCor, Cores> = {
  claro: paletaClara,
  escuro: paletaEscura,
};
