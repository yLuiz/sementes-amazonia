export const environment = {
  production: false,
  useMockData: false,
  apiUrl: 'http://localhost:3000',
  apiVersion: 'v1'
};

export const apiConfig = {
  auth: {
    base: `${environment.apiUrl}/api/${environment.apiVersion}/auth`
  },
  media: {
    base: `${environment.apiUrl}/api/${environment.apiVersion}/media`,
  },
  news: {
    base: `${environment.apiUrl}/api/${environment.apiVersion}/news`,
    featured: `${environment.apiUrl}/api/${environment.apiVersion}/news/featured`,
    paginated: (page: number, limit: number) =>
      `${environment.apiUrl}/api/${environment.apiVersion}/news?page=${page}&limit=${limit}`
  },
  projects: {
    base: `${environment.apiUrl}/api/${environment.apiVersion}/projects`,
    featured: `${environment.apiUrl}/api/${environment.apiVersion}/projects/featured`,
    paginated: (page: number, limit: number) =>
      `${environment.apiUrl}/api/${environment.apiVersion}/projects?page=${page}&limit=${limit}`
  }
};
