// API client for connecting to the real backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

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

export async function fetchEstatisticas(): Promise<Estatisticas> {
  const response = await fetch(`${API_BASE_URL}/aplicacoes/estatisticas`);
  if (!response.ok) throw new Error("Failed to fetch statistics");
  return response.json();
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
