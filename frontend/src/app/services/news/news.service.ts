import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { apiConfig } from '../../config/api.config';
import { IPageResponse } from '../../shared/interfaces/IPageResponse';

export interface INewsFilters {
  page?: number;
  limit?: number;
  direction?: 'ASC' | 'DESC';
  orderBy?: 'created_at' | 'updated_at' | 'published_at' | 'title' | 'id';
  title?: string;
  createdAt?: string; // Formato: 'YYYY-MM-DD,YYYY-MM-DD'
  updatedAt?: string; // Formato: 'YYYY-MM-DD,YYYY-MM-DD'
  publishedAt?: string; // Formato: 'YYYY-MM-DD,YYYY-MM-DD'
}

export interface News {
  id: number,
  title: string,
  summary: string,
  content: string,
  tags: string,
  image_thumb: string,
  published_at: string,
  created_at: string,
  updated_at: string,
}


export interface INewsPortugueseResponse {
  id: number;
  titulo: string;
  resumo: string;
  tags: string; // Separadas por vírgulas.
  imagemThumb: string;
  dataPublicacao: string;
  conteudoCompleto: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private http = inject(HttpClient);

  private readonly apiUrl = apiConfig.news.base;

  /**
   * Busca todas as notícias da API
   * @returns Observable<News[]>
   */
  getNews(filters?: INewsFilters): Observable<IPageResponse<News[]>> {

    const { direction, orderBy, title, createdAt, updatedAt, publishedAt } = filters || {};

    const [page, limit] = [filters?.page ?? 1, filters?.limit ?? 10];

    const filtersInString = `${direction ? `&direction=${direction}` : 'asc'}${orderBy ? `&orderBy=${orderBy}` : 'id'}${title ? `&title=${title}` : ''}${createdAt ? `&createdAt=${createdAt}` : ''}${updatedAt ? `&updatedAt=${updatedAt}` : ''}${publishedAt ? `&publishedAt=${publishedAt}` : ''}`;

    return this.http.get<IPageResponse<News[]>>(this.apiUrl + `?page=${page}&limit=${limit}${filtersInString}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Busca uma notícia específica por ID
   * @param id - ID da notícia
   * @returns Observable<News>
   */
  getNewsById(id: number): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Cria uma nova notícia
   * @param news - Dados da notícia (sem ID)
   * @returns Observable<News>
   */
  createNews(news: FormData): Observable<News> {
    return this.http.post<News>(this.apiUrl, news)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Atualiza uma notícia existente
   * @param id - ID da notícia
   * @param news - Dados atualizados da notícia
   * @returns Observable<News>
   */
  updateNews(id: number, news: Partial<News>): Observable<News> {
    return this.http.put<News>(`${this.apiUrl}/${id}`, news)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Remove uma notícia
   * @param id - ID da notícia
   * @returns Observable<boolean>
   */
  deleteNews(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        map(() => true),
        catchError(this.handleError)
      );
  }

  /**
   * Busca notícias em destaque
   * @returns Observable<News[]>
   */
  getFeaturedNews(): Observable<News[]> {
    return this.http.get<News[]>(`${this.apiUrl}/featured`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Busca notícias com paginação
   * @param page - Número da página
   * @param limit - Quantidade de itens por página
   * @returns Observable<{news: News[], total: number, page: number, limit: number}>
   */
  getNewsPaginated(page: number = 1, limit: number = 10): Observable<{
    news: News[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.http.get<{
      news: News[];
      total: number;
      page: number;
      limit: number;
    }>(`${this.apiUrl}?page=${page}&limit=${limit}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Manipula erros HTTP
   * @param error - Erro HTTP
   * @returns Observable<never>
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro desconhecido';

    if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = `Código: ${error.status}\nMensagem: ${error.message}`;
    }

    console.error('Erro na API:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}