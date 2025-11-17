// API client for connecting to the real backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

// ============================================
// INTERFACES - APLICAÇÕES
// ============================================

export interface Aplicacao {
  id: number;
  nome: string;
  versao_dotnet: string | null;
  ef_core: string | null;
  acao: string;
  risco: string;
  linguagem: string;
  prontidao_migracao: number;
  justificativa_prontidao?: string;
}

export interface Estatisticas {
  total_aplicacoes: number;
  por_risco: Record<string, number>;
  por_linguagem: Record<string, number>;
  por_dotnet: Record<string, number>;
  media_prontidao: number;
  total_criticas: number;
  usa_jwt_manual: number;
  usa_sauron: number;
}

// ============================================
// INTERFACES - SAURON
// ============================================

export interface SauronModule {
  id: number;
  nome: string;
  linguagem: string;
  versao_dotnet: string;
  tipo_projeto: string;
  ef_core: boolean;
  ef_core_versao: string | null;
  pacotes_nuget_qtd: number;
  impacto: string;
}

export interface SauronModuleDetail extends SauronModule {
  pacotes_nuget_lista: string;
  referencias_internas: string;
  usa_identityserver: boolean;
  usa_ldap: boolean;
  usa_jwt_manual: boolean;
  tipo_banco: string;
  possui_migrations: boolean;
  qtde_migrations: number;
  usa_swagger: boolean;
  controllers: string;
  observacao: string;
  acao_recomendada: string;
  dependencias_internas: Array<{
    nome: string;
    versao: string;
    critica: boolean;
  }>;
}

export interface SauronStatistics {
  total_modulos: number;
  por_tipo: Record<string, number>;
  por_linguagem: Record<string, number>;
  por_dotnet: Record<string, number>;
  usa_identityserver: number;
  usa_ldap: number;
  usa_jwt_manual: number;
  com_ef_core: number;
  com_migrations: number;
  dependencias_criticas: number;
}

export interface SauronRisks {
  alto: number;
  medio: number;
  baixo: number;
}

export interface CriticalDependency {
  nome: string;
  versao: string;
  modulo: string;
  modulo_id: number;
}

// ============================================
// FUNÇÕES - APLICAÇÕES
// ============================================

export async function fetchEstatisticas(): Promise<Estatisticas> {
  const response = await fetch(`${API_BASE_URL}/aplicacoes/estatisticas`);
  if (!response.ok) throw new Error("Failed to fetch statistics");

  const json = await response.json();
  return json.data ?? json;
}

export async function fetchAplicacoes(params?: {
  risco?: string;
  linguagem?: string;
  search?: string;
}): Promise<Aplicacao[]> {
  const searchParams = new URLSearchParams();
  if (params?.risco) searchParams.append("risco", params.risco);
  if (params?.linguagem) searchParams.append("linguagem", params.linguagem);
  if (params?.search) searchParams.append("search", params.search);

  const url = `${API_BASE_URL}/aplicacoes${
    searchParams.toString() ? `?${searchParams}` : ""
  }`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch applications");
  return response.json();
}

export async function fetchAplicacaoPorNome(
  nome: string
): Promise<Aplicacao | null> {
  const applications = await fetchAplicacoes();
  return applications.find((app) => app.nome === nome) || null;
}

export async function fetchCandidatas(): Promise<Aplicacao[]> {
  const response = await fetch(`${API_BASE_URL}/aplicacoes/candidatas`);
  if (!response.ok) throw new Error("Failed to fetch candidates");
  return response.json();
}

export async function fetchDependencias(aplicacaoId: number): Promise<any[]> {
  const response = await fetch(
    `${API_BASE_URL}/aplicacoes/${aplicacaoId}/dependencias`
  );
  if (!response.ok) return [];
  return response.json();
}

export async function fetchVulnerabilidades(
  aplicacaoId: number
): Promise<any[]> {
  const response = await fetch(
    `${API_BASE_URL}/aplicacoes/${aplicacaoId}/vulnerabilidades`
  );
  if (!response.ok) return [];
  return response.json();
}

// ============================================
// FUNÇÕES - SAURON
// ============================================

export async function fetchSauronModules(): Promise<SauronModule[]> {
  const response = await fetch(`${API_BASE_URL}/sauron_modulos`);
  if (!response.ok) throw new Error("Failed to fetch SAURON modules");
  const json = await response.json();
  return json.data ?? json;
}

export async function fetchSauronStatistics(): Promise<SauronStatistics> {
  const response = await fetch(`${API_BASE_URL}/sauron_modulos/estatisticas`);
  if (!response.ok) throw new Error("Failed to fetch SAURON statistics");
  const json = await response.json();
  return json.data ?? json;
}

export async function fetchSauronRisks(): Promise<SauronRisks> {
  const response = await fetch(`${API_BASE_URL}/sauron_modulos/riscos`);
  if (!response.ok) throw new Error("Failed to fetch SAURON risks");
  const json = await response.json();
  return json.data ?? json;
}

export async function fetchCriticalDependencies(): Promise<CriticalDependency[]> {
  const response = await fetch(`${API_BASE_URL}/sauron_modulos/dependencias_criticas`);
  if (!response.ok) throw new Error("Failed to fetch critical dependencies");
  const json = await response.json();
  return json.data ?? json;
}

export async function fetchSauronModuleDetail(id: number): Promise<SauronModuleDetail> {
  const response = await fetch(`${API_BASE_URL}/sauron_modulos/${id}`);
  if (!response.ok) throw new Error("Failed to fetch SAURON module detail");
  const json = await response.json();
  return json.data ?? json;
}
