import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';

import { paletas, type Cores, type EsquemaDeCor } from './paletas';

/** O que o usuário escolheu na tela de conta. */
export type PreferenciaDeTema = 'sistema' | 'claro' | 'escuro';

type TemaContextValor = {
  /** Paleta efetivamente aplicada agora. */
  cores: Cores;
  /** Esquema resolvido (a preferência "sistema" vira claro ou escuro). */
  esquema: EsquemaDeCor;
  preferencia: PreferenciaDeTema;
  definirPreferencia: (preferencia: PreferenciaDeTema) => void;
};

const CHAVE_ARMAZENAMENTO = '@consertaai/preferencia-tema';

const TemaContext = createContext<TemaContextValor | null>(null);

function ehPreferenciaValida(valor: string | null): valor is PreferenciaDeTema {
  return valor === 'sistema' || valor === 'claro' || valor === 'escuro';
}

/**
 * Fornece o tema para toda a árvore.
 *
 * Por padrão segue o modo claro/escuro do sistema operacional e reage quando o
 * usuário troca o modo do aparelho com o app aberto. A escolha manual feita na
 * tela de conta fica salva no AsyncStorage e é restaurada na próxima abertura.
 */
export function TemaProvider({ children }: { children: ReactNode }) {
  const esquemaDoSistema = useColorScheme();
  const [preferencia, setPreferencia] = useState<PreferenciaDeTema>('sistema');

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_ARMAZENAMENTO)
      .then((salva) => {
        if (ehPreferenciaValida(salva)) setPreferencia(salva);
      })
      .catch(() => {
        // Sem acesso ao armazenamento: segue o sistema.
      });
  }, []);

  const definirPreferencia = useCallback((nova: PreferenciaDeTema) => {
    setPreferencia(nova);
    AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, nova).catch(() => {});
  }, []);

  const esquema: EsquemaDeCor =
    preferencia === 'sistema'
      ? esquemaDoSistema === 'light'
        ? 'claro'
        : 'escuro'
      : preferencia;

  const valor = useMemo(
    () => ({ cores: paletas[esquema], esquema, preferencia, definirPreferencia }),
    [esquema, preferencia, definirPreferencia]
  );

  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}

export function useTema(): TemaContextValor {
  const contexto = useContext(TemaContext);
  if (!contexto) {
    throw new Error('useTema precisa ser usado dentro de TemaProvider.');
  }
  return contexto;
}
