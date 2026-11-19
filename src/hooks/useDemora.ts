import { useEffect, useState } from 'react';

/**
 * Fica `true` quando um carregamento passa de alguns segundos. Usado para
 * trocar o "Carregando..." por um aviso de que o servidor está acordando,
 * em vez de deixar o usuário achando que o app travou.
 */
export function useDemora(carregando: boolean, aposMs = 5000): boolean {
  const [demorando, setDemorando] = useState(false);

  useEffect(() => {
    if (!carregando) return;
    const temporizador = setTimeout(() => setDemorando(true), aposMs);
    return () => {
      clearTimeout(temporizador);
      setDemorando(false);
    };
  }, [carregando, aposMs]);

  return carregando && demorando;
}
