import { useMemo } from 'react';

import type { Cores } from './paletas';
import { useTema } from './TemaContext';

/**
 * Cria um hook de estilos que depende do tema.
 *
 * Substitui o `StyleSheet.create` no nível do módulo, que é avaliado uma única
 * vez e por isso congelaria as cores do primeiro tema. A fábrica recebe a
 * paleta atual e só é executada de novo quando o tema muda.
 *
 * @example
 * const useEstilos = criarEstilos((cores) =>
 *   StyleSheet.create({ titulo: { color: cores.texto } })
 * );
 *
 * function Componente() {
 *   const styles = useEstilos();
 *   return <Text style={styles.titulo}>Olá</Text>;
 * }
 */
export function criarEstilos<T>(fabrica: (cores: Cores) => T): () => T {
  return function useEstilos(): T {
    const { cores } = useTema();
    return useMemo(() => fabrica(cores), [cores]);
  };
}
