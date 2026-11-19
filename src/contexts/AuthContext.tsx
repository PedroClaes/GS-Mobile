import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { aoReceberNaoAutorizado, definirToken } from '../api/httpClient';
import { sessaoStorage } from '../api/sessaoStorage';
import { authService } from '../services/authService';
import type { DadosCadastro, Sessao, Usuario } from '../types';

type AuthContextValor = {
  usuario: Usuario | null;
  /** `true` enquanto a sessão salva no aparelho é restaurada. */
  carregandoSessao: boolean;
  /** Avisa a tela de login quando a sessão caiu por expiração do token. */
  sessaoExpirou: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (dados: DadosCadastro) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValor | null>(null);

/**
 * Sessão do usuário, compartilhada pelo app inteiro.
 *
 * O login é feito uma única vez na API Java; o token fica no SecureStore e no
 * cliente HTTP, que o envia nas duas APIs. Quando qualquer chamada autenticada
 * volta 401, a sessão é encerrada e as rotas protegidas somem da navegação.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);
  const [sessaoExpirou, setSessaoExpirou] = useState(false);

  const iniciarSessao = useCallback(async (sessao: Sessao) => {
    definirToken(sessao.token);
    await sessaoStorage.salvar(sessao);
    setSessaoExpirou(false);
    setUsuario(sessao.usuario);
  }, []);

  const encerrarSessao = useCallback(async () => {
    definirToken(null);
    setUsuario(null);
    // Nada do usuário anterior pode aparecer para o próximo.
    queryClient.clear();
    await sessaoStorage.limpar();
  }, [queryClient]);

  useEffect(() => {
    sessaoStorage.carregar().then((sessao) => {
      if (sessao) {
        definirToken(sessao.token);
        setUsuario(sessao.usuario);
      }
      setCarregandoSessao(false);
    });
  }, []);

  useEffect(() => {
    aoReceberNaoAutorizado(() => {
      setSessaoExpirou(true);
      encerrarSessao();
    });
    return () => aoReceberNaoAutorizado(null);
  }, [encerrarSessao]);

  const entrar = useCallback(
    async (email: string, senha: string) => {
      const sessao = await authService.entrar({
        email: email.trim().toLowerCase(),
        senha,
      });
      await iniciarSessao(sessao);
    },
    [iniciarSessao]
  );

  const cadastrar = useCallback(
    async (dados: DadosCadastro) => {
      const sessao = await authService.cadastrar({
        nome: dados.nome.trim(),
        email: dados.email.trim().toLowerCase(),
        senha: dados.senha,
        bairro: dados.bairro?.trim() || undefined,
      });
      await iniciarSessao(sessao);
    },
    [iniciarSessao]
  );

  const sair = useCallback(async () => {
    setSessaoExpirou(false);
    await encerrarSessao();
  }, [encerrarSessao]);

  const valor = useMemo(
    () => ({ usuario, carregandoSessao, sessaoExpirou, entrar, cadastrar, sair }),
    [usuario, carregandoSessao, sessaoExpirou, entrar, cadastrar, sair]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValor {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth precisa ser usado dentro de AuthProvider.');
  return contexto;
}
