import type { DadosCadastro, DadosOcorrencia } from '../types';

/**
 * Validações de formulário espelhando as regras das APIs. Validar antes de
 * enviar evita uma ida ao servidor (que pode estar acordando) só para receber
 * um 400; se ainda assim a API recusar, os erros dela aparecem nos mesmos campos.
 */
export type ErrosDeCampo<T> = Partial<Record<keyof T, string>>;

const EMAIL = /^\S+@\S+\.\S+$/;

export function validarLogin(email: string, senha: string) {
  const erros: ErrosDeCampo<{ email: string; senha: string }> = {};
  if (!EMAIL.test(email.trim())) erros.email = 'Informe um e-mail válido.';
  if (!senha) erros.senha = 'Informe a senha.';
  return erros;
}

export function validarCadastro(dados: DadosCadastro & { confirmacao: string }) {
  const erros: ErrosDeCampo<DadosCadastro & { confirmacao: string }> = {};
  if (dados.nome.trim().length < 2) erros.nome = 'Informe seu nome.';
  else if (dados.nome.trim().length > 100)
    erros.nome = 'Nome com no máximo 100 caracteres.';
  if (!EMAIL.test(dados.email.trim())) erros.email = 'Informe um e-mail válido.';
  if (dados.senha.length < 6 || dados.senha.length > 72)
    erros.senha = 'A senha deve ter entre 6 e 72 caracteres.';
  if (dados.confirmacao !== dados.senha) erros.confirmacao = 'As senhas não conferem.';
  if ((dados.bairro ?? '').trim().length > 80)
    erros.bairro = 'Bairro com no máximo 80 caracteres.';
  return erros;
}

export function validarOcorrencia(dados: DadosOcorrencia) {
  const erros: ErrosDeCampo<DadosOcorrencia> = {};
  const titulo = dados.titulo.trim().length;
  const descricao = dados.descricao.trim().length;
  if (titulo < 5 || titulo > 120)
    erros.titulo = 'O título deve ter entre 5 e 120 caracteres.';
  if (descricao < 10 || descricao > 1000)
    erros.descricao = 'A descrição deve ter entre 10 e 1000 caracteres.';
  if (!dados.endereco.trim()) erros.endereco = 'Informe o endereço.';
  else if (dados.endereco.trim().length > 200) erros.endereco = 'Endereço muito longo.';
  if (!dados.bairro.trim()) erros.bairro = 'Informe o bairro.';
  return erros;
}

export function validarComentario(texto: string): string | undefined {
  const tamanho = texto.trim().length;
  if (tamanho < 3 || tamanho > 1000)
    return 'O comentário deve ter entre 3 e 1000 caracteres.';
  return undefined;
}

export function semErros(erros: object): boolean {
  return Object.keys(erros).length === 0;
}
