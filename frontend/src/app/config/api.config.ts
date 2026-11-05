// A API é servida na mesma origem do site: pelo proxy do `ng serve` em
// desenvolvimento (proxy.conf.json) e pelo rewrite da Vercel em produção
// (vercel.json). Assim nenhum ambiente precisa de uma URL própria aqui.
const apiBase = '/api/v1';

export const apiConfig = {
  auth: {
    base: `${apiBase}/auth`,
  },
  media: {
    base: `${apiBase}/media`,
  },
  news: {
    base: `${apiBase}/news`,
  },
  projects: {
    base: `${apiBase}/projects`,
  },
};
