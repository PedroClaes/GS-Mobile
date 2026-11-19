import { apiJava } from '../api/httpClient';
import type { DadosCadastro, DadosLogin, Sessao, Usuario } from '../types';

/** Autenticação na API Java. O token devolvido também vale na API .NET. */
export const authService = {
  entrar(dados: DadosLogin): Promise<Sessao> {
    return apiJava.post<Sessao>('/auth/login', { corpo: dados });
  },

  /** O cadastro público sempre cria um CIDADAO e já devolve o token. */
  cadastrar(dados: DadosCadastro): Promise<Sessao> {
    return apiJava.post<Sessao>('/auth/registro', { corpo: dados });
  },

  perfil(): Promise<Usuario> {
    return apiJava.get<Usuario>('/auth/me');
  },
};
