import { ContentType } from '../../shared/ui/content-card.component';

export const CONTENT_LABELS: Record<
  ContentType,
  {
    plural: string;
    newItem: string;
    edit: string;
    thisItem: string;
    emptyTitle: string;
    deleted: string;
    created: string;
    updated: string;
    titleLabel: string;
    contentLabel: string;
    contentPlaceholder: string;
    summaryPlaceholder: string;
    authorPlaceholder: string;
    publish: string;
    update: string;
    notFound: string;
    loadError: string;
  }
> = {
  news: {
    plural: 'Notícias',
    newItem: 'Nova notícia',
    edit: 'Editar notícia',
    thisItem: 'esta notícia',
    emptyTitle: 'Nenhuma notícia publicada',
    deleted: 'Notícia removida com sucesso!',
    created: 'Notícia criada com sucesso.',
    updated: 'Notícia atualizada com sucesso.',
    titleLabel: 'Título da notícia',
    contentLabel: 'Conteúdo completo',
    contentPlaceholder: 'Digite aqui o texto principal da notícia',
    summaryPlaceholder: 'Escreva um breve resumo para destacar os principais pontos da notícia',
    authorPlaceholder: 'Nome do autor da notícia',
    publish: 'Publicar notícia',
    update: 'Atualizar notícia',
    notFound: 'Notícia não encontrada',
    loadError: 'Não foi possível carregar as notícias',
  },
  project: {
    plural: 'Projetos',
    newItem: 'Novo projeto',
    edit: 'Editar projeto',
    thisItem: 'este projeto',
    emptyTitle: 'Nenhum projeto publicado',
    deleted: 'Projeto removido com sucesso!',
    created: 'Projeto criado com sucesso.',
    updated: 'Projeto atualizado com sucesso.',
    titleLabel: 'Nome do projeto',
    contentLabel: 'Descrição completa',
    contentPlaceholder: 'Conte em detalhes sobre o projeto, objetivos, processo e resultados',
    summaryPlaceholder: 'Escreva um breve resumo para destacar os principais pontos do projeto',
    authorPlaceholder: 'Nome do autor do projeto',
    publish: 'Publicar projeto',
    update: 'Atualizar projeto',
    notFound: 'Projeto não encontrado',
    loadError: 'Não foi possível carregar os projetos',
  },
};
