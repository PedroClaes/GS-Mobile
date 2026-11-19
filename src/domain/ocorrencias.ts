import type { Cores } from '../theme';
import type { Ocorrencia, Papel, StatusOcorrencia, Urgencia, Usuario } from '../types';

/** Regras e textos de exibição das ocorrências. Funções puras, sem rede. */

export const ROTULO_DO_STATUS: Record<StatusOcorrencia, string> = {
  EM_TRIAGEM: 'Em análise',
  ABERTA: 'Aberta',
  EM_ANDAMENTO: 'Em andamento',
  RESOLVIDA: 'Resolvida',
  CANCELADA: 'Cancelada',
};

export function corDoStatus(status: StatusOcorrencia, cores: Cores): string {
  const mapa: Record<StatusOcorrencia, string> = {
    EM_TRIAGEM: cores.ia,
    ABERTA: cores.primaria,
    EM_ANDAMENTO: cores.info,
    RESOLVIDA: cores.sucesso,
    CANCELADA: cores.textoTerciario,
  };
  return mapa[status];
}

export const ROTULO_DA_URGENCIA: Record<Urgencia, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
  CRITICA: 'Crítica',
};

/** Verde, amarelo, laranja e vermelho, como no guia de integração. */
export function corDaUrgencia(urgencia: Urgencia, cores: Cores): string {
  const mapa: Record<Urgencia, string> = {
    BAIXA: cores.sucesso,
    MEDIA: cores.alerta,
    ALTA: cores.primaria,
    CRITICA: cores.erro,
  };
  return mapa[urgencia];
}

/** Transições que o gestor pode fazer a partir de cada status (regra da API Java). */
export const TRANSICOES_DO_GESTOR: Record<StatusOcorrencia, StatusOcorrencia[]> = {
  EM_TRIAGEM: [],
  ABERTA: ['EM_ANDAMENTO', 'RESOLVIDA', 'CANCELADA'],
  EM_ANDAMENTO: ['RESOLVIDA', 'CANCELADA'],
  RESOLVIDA: [],
  CANCELADA: [],
};

export const STATUS_EDITAVEIS: StatusOcorrencia[] = ['EM_TRIAGEM', 'ABERTA'];

export function ehAutor(ocorrencia: Ocorrencia, usuario: Usuario | null): boolean {
  return usuario !== null && ocorrencia.autor.id === usuario.id;
}

/** O autor edita enquanto a ocorrência ainda não foi atendida. */
export function podeEditar(ocorrencia: Ocorrencia, usuario: Usuario | null): boolean {
  return ehAutor(ocorrencia, usuario) && STATUS_EDITAVEIS.includes(ocorrencia.status);
}

/** O autor exclui enquanto não foi atendida; o gestor, sempre. */
export function podeExcluir(ocorrencia: Ocorrencia, usuario: Usuario | null): boolean {
  if (usuario?.papel === 'GESTOR') return true;
  return podeEditar(ocorrencia, usuario);
}

/** Apoiar é coisa de cidadão, e não da própria ocorrência. */
export function podeApoiar(ocorrencia: Ocorrencia, usuario: Usuario | null): boolean {
  return (
    usuario?.papel === 'CIDADAO' &&
    !ehAutor(ocorrencia, usuario) &&
    ['ABERTA', 'EM_ANDAMENTO'].includes(ocorrencia.status)
  );
}

export function ehGestor(papel: Papel | undefined): boolean {
  return papel === 'GESTOR';
}

// ---------- Datas ----------

/**
 * As duas APIs gravam o horário em UTC, mas a Java (LocalDateTime) e a .NET
 * (DateTime lido do banco) às vezes o enviam sem fuso: "2026-11-18T12:40:00".
 * Sem o "Z", o JavaScript leria como horário local e mostraria 3 horas a mais.
 */
export function paraData(iso: string): Date {
  const temFuso = /(Z|[+-]\d{2}:?\d{2})$/.test(iso);
  return new Date(temFuso ? iso : `${iso}Z`);
}

/** "18/11/2026 às 09:40" a partir de um LocalDateTime da Java. */
export function formatarDataHora(iso: string | null): string {
  if (!iso) return '—';
  const data = paraData(iso);
  if (Number.isNaN(data.getTime())) return '—';
  const dd = String(data.getDate()).padStart(2, '0');
  const mm = String(data.getMonth() + 1).padStart(2, '0');
  const hh = String(data.getHours()).padStart(2, '0');
  const min = String(data.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${data.getFullYear()} às ${hh}:${min}`;
}

/** "24/11" a partir de uma data AAAA-MM-DD, sem passar por fuso horário. */
export function formatarDiaMes(dataIso: string | null): string {
  if (!dataIso) return '—';
  const [, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}`;
}

/** "há 5 min", "há 3 h", "há 2 dias". */
export function tempoDecorrido(iso: string, agora: Date = new Date()): string {
  const minutos = Math.max(
    0,
    Math.round((agora.getTime() - paraData(iso).getTime()) / 60000)
  );
  if (minutos < 1) return 'agora';
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `há ${horas} h`;
  const dias = Math.round(horas / 24);
  return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
}
