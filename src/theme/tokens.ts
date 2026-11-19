/** Medidas e tipografia que não mudam entre os temas claro e escuro. */

export const espacos = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const raios = {
  sm: 8,
  md: 12,
  lg: 16,
  pilula: 999,
} as const;

export const fontes = {
  titulo: 26,
  secao: 15,
  corpo: 15,
  auxiliar: 13,
  mini: 11,
} as const;

/**
 * Famílias carregadas em `app/_layout.tsx` a partir de `assets/fonts`.
 * Sora (títulos) e Inter (texto), ambas sob licença OFL.
 *
 * Com fonte customizada, o peso vem do arquivo: usar `fontWeight` junto faz o
 * Android trocar pela fonte do sistema. Por isso os estilos usam só `fontFamily`.
 */
export const familias = {
  titulo: 'Sora_700Bold',
  tituloMedio: 'Sora_600SemiBold',
  texto: 'Inter_400Regular',
  textoMedio: 'Inter_500Medium',
  textoForte: 'Inter_600SemiBold',
  textoNegrito: 'Inter_700Bold',
} as const;
