import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { Sessao } from '../types';

/**
 * Guarda a sessão (token JWT + dados do usuário) entre aberturas do app.
 *
 * No celular o token vai para o `expo-secure-store` (Keystore no Android,
 * Keychain no iOS), que é criptografado — e não para o AsyncStorage, que é
 * texto puro. Na web o SecureStore não existe; ali o AsyncStorage é o reserva
 * para o app continuar funcionando no navegador durante o desenvolvimento.
 */
const CHAVE = 'consertaai.sessao';

const armazenamento =
  Platform.OS === 'web'
    ? {
        ler: () => AsyncStorage.getItem(CHAVE),
        gravar: (valor: string) => AsyncStorage.setItem(CHAVE, valor),
        apagar: () => AsyncStorage.removeItem(CHAVE),
      }
    : {
        ler: () => SecureStore.getItemAsync(CHAVE),
        gravar: (valor: string) => SecureStore.setItemAsync(CHAVE, valor),
        apagar: () => SecureStore.deleteItemAsync(CHAVE),
      };

function sessaoValida(sessao: Sessao): boolean {
  return Boolean(sessao.token) && new Date(sessao.expiraEm).getTime() > Date.now();
}

export const sessaoStorage = {
  /** Sessão salva, ou `null` se não houver ou se o token já expirou. */
  async carregar(): Promise<Sessao | null> {
    try {
      const salvo = await armazenamento.ler();
      if (!salvo) return null;
      const sessao = JSON.parse(salvo) as Sessao;
      if (sessaoValida(sessao)) return sessao;
      await armazenamento.apagar();
      return null;
    } catch {
      return null;
    }
  },

  salvar(sessao: Sessao): Promise<void> {
    return armazenamento.gravar(JSON.stringify(sessao));
  },

  async limpar(): Promise<void> {
    await armazenamento.apagar().catch(() => {});
  },
};
