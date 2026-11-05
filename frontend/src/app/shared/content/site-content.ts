/**
 * Textos institucionais em um único lugar, para facilitar a troca quando a
 * organização enviar os dados definitivos.
 *
 * PENDENTE DE CONFIRMAÇÃO (ver docs/plans/2026-11-04-roadmap.md):
 * - `stats`: os números vêm do site anterior e as legendas foram deduzidas dos ícones.
 * - `contact`: endereço, telefone e e-mail parecem provisórios.
 * - `partners`: só a Petrobras está identificada no conteúdo atual; faltam os logos.
 */
export const SITE_CONTENT = {
  about:
    'O Sementes da Amazônia é uma organização comprometida com a conservação ambiental, a valorização da biodiversidade amazônica e a promoção de práticas sustentáveis.',
  aboutDetail:
    'Fundado em 2021, nasce com o propósito de conectar conhecimento técnico, saberes tradicionais e sustentabilidade, contribuindo para a proteção de ecossistemas, fortalecimento de cadeias produtivas e geração de renda para populações locais.',
  tagline: 'Trabalhando juntos por um futuro sustentável e pela proteção dos nossos recursos naturais.',

  heroHighlights: [
    { value: '2021', label: 'Ano de fundação' },
    { value: '6', label: 'Áreas de atuação' },
  ],

  stats: [
    { value: '+ 500 mil', label: 'Pessoas alcançadas', icon: 'assets/language.svg' },
    { value: '+ 100', label: 'Campanhas realizadas', icon: 'assets/campaign.svg' },
    { value: '+ 50', label: 'Comunidades atendidas', icon: 'assets/people.svg' },
    { value: '+ 20 mil', label: 'Mudas plantadas', icon: 'assets/spa.svg' },
  ],

  partners: [{ name: 'Petrobras', logo: null as string | null }],

  contact: {
    address: 'Av. da Conservação 123, Distrito da Floresta',
    phone: '+55 11 1234-5678',
    email: 'contato@associacaosemfinslucrativos.org',
  },
};
