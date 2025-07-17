// Configuração de ambiente para desenvolvimento
export const environment = {
  production: false,
  useMockData: true, // Alterar para false quando a API estiver pronta agora ta so a gastação pura
  apiUrl: 'https://api.sementes-amazonia.com', // bota a api de vdd aqui quando tiver sla 
  apiVersion: 'v1'
};

export const apiConfig = {
  projects: {
    base: `${environment.apiUrl}/api/${environment.apiVersion}/projects`,
    featured: `${environment.apiUrl}/api/${environment.apiVersion}/projects/featured`,
    paginated: (page: number, limit: number) => 
      `${environment.apiUrl}/api/${environment.apiVersion}/projects?page=${page}&limit=${limit}`
  }
};
