import * as Application from 'expo-application';
import Constants from 'expo-constants';

/**
 * Identificação da versão em execução, exibida na tela "Sobre o App".
 *
 * O hash do commit e a data do build são gravados no `extra` do app config
 * durante o build (ver `app.config.js`); versão e número do build vêm do
 * binário nativo instalado, com o app config como reserva no Expo Go.
 */
type ExtraDoBuild = {
  commitHash?: string;
  alteracoesNaoCommitadas?: boolean;
  geradoEm?: string;
  perfilDeBuild?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExtraDoBuild;
const commit = extra.commitHash ?? 'desconhecido';

export const INFO_DA_VERSAO = {
  versao: Application.nativeApplicationVersion ?? Constants.expoConfig?.version ?? '—',
  build: Application.nativeBuildVersion ?? '—',
  commit,
  commitCurto: /^[0-9a-f]{7,40}$/.test(commit) ? commit.slice(0, 7) : commit,
  alteracoesNaoCommitadas: extra.alteracoesNaoCommitadas ?? false,
  geradoEm: extra.geradoEm ? new Date(extra.geradoEm) : null,
  /** Perfil do eas.json (development, preview, production) ou "local". */
  perfil: process.env.EXPO_PUBLIC_APP_ENV ?? extra.perfilDeBuild ?? 'local',
  pacote: Application.applicationId ?? Constants.expoConfig?.android?.package ?? '—',
} as const;
