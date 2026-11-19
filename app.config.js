const { execSync } = require('node:child_process');

/**
 * Complementa o app.json com a identificação da versão publicada.
 *
 * O hash do commit é lido no momento do build e embutido no aplicativo, para
 * que a tela "Sobre o App" mostre exatamente qual código gerou o APK.
 * - No EAS Build, vem da variável `EAS_BUILD_GIT_COMMIT_HASH`.
 * - Localmente (expo start / prebuild), vem do `git rev-parse HEAD`.
 */
function git(comando) {
  try {
    return execSync(`git ${comando}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

function hashDoCommit() {
  return process.env.EAS_BUILD_GIT_COMMIT_HASH ?? git('rev-parse HEAD') ?? 'desconhecido';
}

/**
 * Em builds locais, avisa se havia alterações ainda não commitadas — nesse caso
 * o app não corresponde exatamente ao hash exibido. No EAS, a opção
 * `requireCommit` do eas.json já impede build com alterações pendentes.
 */
function temAlteracoesNaoCommitadas() {
  if (process.env.EAS_BUILD_GIT_COMMIT_HASH) return false;
  const status = git('status --porcelain');
  return status !== null && status.length > 0;
}

/** @param {import('expo/config').ConfigContext} contexto */
module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commitHash: hashDoCommit(),
    alteracoesNaoCommitadas: temAlteracoesNaoCommitadas(),
    geradoEm: new Date().toISOString(),
    perfilDeBuild: process.env.EAS_BUILD_PROFILE ?? 'local',
  },
});
