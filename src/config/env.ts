/**
 * Endereços das duas APIs do Conserta Aí.
 *
 * - API Java (Spring Boot, Render): usuários, login (JWT), ocorrências e a
 *   triagem por IA generativa.
 * - API .NET (Minimal API, Azure App Service): apoios, comentários e etiquetas. Aceita o
 *   mesmo token emitido pela Java.
 *
 * Podem ser trocados por variáveis `EXPO_PUBLIC_*` (arquivo `.env`, ver
 * `.env.example`). Não são segredos: o controle de acesso é o JWT.
 */
function semBarraFinal(url: string): string {
  return url.replace(/\/+$/, '');
}

export const API_JAVA_URL = semBarraFinal(
  process.env.EXPO_PUBLIC_API_JAVA_URL ?? 'https://gs-java-5k10.onrender.com'
);

export const API_NET_URL = semBarraFinal(
  process.env.EXPO_PUBLIC_API_NET_URL ??
    'https://consertaai-api-rm563454.azurewebsites.net'
);

/**
 * A Java fica no plano gratuito do Render, que hiberna sem uso: a primeira
 * chamada pode levar perto de 1 minuto. Abaixo disso o app desistiria antes de
 * o servidor acordar.
 */
export const TEMPO_LIMITE_REQUISICAO_MS = 60_000;
