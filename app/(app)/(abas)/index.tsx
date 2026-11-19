import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ListaDeOcorrencias } from '../../../src/components/ocorrencias/ListaDeOcorrencias';
import { BotaoFlutuante } from '../../../src/components/ui/BotaoFlutuante';
import {
  SeletorDeChips,
  type OpcaoDeChip,
} from '../../../src/components/ui/SeletorDeChips';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useOcorrenciasDaCidade } from '../../../src/hooks/useOcorrencias';
import {
  criarEstilos,
  espacos,
  familias,
  fontes,
  raios,
  useTema,
} from '../../../src/theme';
import type { StatusOcorrencia } from '../../../src/types';

type FiltroDeStatus = StatusOcorrencia | 'TODAS';

const OPCOES_DE_STATUS: OpcaoDeChip<FiltroDeStatus>[] = [
  { valor: 'TODAS', rotulo: 'Todas' },
  { valor: 'ABERTA', rotulo: 'Abertas' },
  { valor: 'EM_ANDAMENTO', rotulo: 'Em andamento' },
  { valor: 'RESOLVIDA', rotulo: 'Resolvidas' },
  { valor: 'EM_TRIAGEM', rotulo: 'Em análise' },
];

/** Espera o usuário parar de digitar antes de consultar a API. */
function useValorAtrasado(valor: string, atrasoMs = 500): string {
  const [atrasado, setAtrasado] = useState(valor);
  useEffect(() => {
    const temporizador = setTimeout(() => setAtrasado(valor), atrasoMs);
    return () => clearTimeout(temporizador);
  }, [valor, atrasoMs]);
  return atrasado;
}

/** Ocorrências públicas da cidade, com filtro por status e bairro. */
export default function CidadeScreen() {
  const { cores } = useTema();
  const styles = useEstilos();
  const router = useRouter();
  const { usuario } = useAuth();
  const [status, setStatus] = useState<FiltroDeStatus>('TODAS');
  const [bairro, setBairro] = useState('');
  const bairroBuscado = useValorAtrasado(bairro.trim());

  const consulta = useOcorrenciasDaCidade({
    status: status === 'TODAS' ? undefined : status,
    bairro: bairroBuscado || undefined,
  });

  const cidadao = usuario?.papel === 'CIDADAO';

  return (
    <View style={styles.tela}>
      <ListaDeOcorrencias
        consulta={consulta}
        cabecalho={
          <View style={styles.filtros}>
            <TextInput
              style={styles.busca}
              placeholder="🔎 Filtrar por bairro"
              placeholderTextColor={cores.textoTerciario}
              value={bairro}
              onChangeText={setBairro}
              accessibilityLabel="Filtrar por bairro"
              returnKeyType="search"
            />
            <SeletorDeChips
              emLinha
              opcoes={OPCOES_DE_STATUS}
              selecionados={[status]}
              aoAlternar={setStatus}
            />
          </View>
        }
        vazio={{
          titulo: 'Nada por aqui',
          descricao: bairroBuscado
            ? `Nenhuma ocorrência encontrada em "${bairroBuscado}".`
            : 'Nenhuma ocorrência com esse filtro.',
        }}
      />
      {cidadao && (
        <BotaoFlutuante
          titulo="Reportar"
          aoPressionar={() => router.push('/ocorrencias/nova')}
        />
      )}
    </View>
  );
}

const useEstilos = criarEstilos((cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: cores.fundo },
    filtros: { marginBottom: espacos.md, gap: espacos.sm },
    busca: {
      height: 46,
      borderRadius: raios.md,
      borderWidth: 1,
      borderColor: cores.borda,
      backgroundColor: cores.superficie,
      paddingHorizontal: espacos.md,
      color: cores.texto,
      fontFamily: familias.texto,
      fontSize: fontes.corpo,
    },
  })
);
