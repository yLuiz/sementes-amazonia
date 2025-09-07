import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
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

export interface INews {
  id: number,
  title: string,
  summary: string,
  content: string,
  tags: string,
  author?: string,
  image_thumb: string,
  published_at: string,
  created_at: string,
  updated_at: string,
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

  getNews(filters?: INewsFilters): Observable<IPageResponse<INews[]>> {
    const { direction, orderBy, title, createdAt, updatedAt, publishedAt } = filters || {};
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;

    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit))
      .set('direction', direction ?? 'desc')
      .set('orderBy', orderBy ?? 'id');

    if (title) params = params.set('title', title);
    if (createdAt) params = params.set('createdAt', createdAt);
    if (updatedAt) params = params.set('updatedAt', updatedAt);
    if (publishedAt) params = params.set('publishedAt', publishedAt);

    return this.http
      .get<IPageResponse<INews[]>>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Busca uma notícia específica por ID
   * @param id - ID da notícia
   * @returns Observable<News>
   */
  getNewsById(id: number): Observable<INews> {
    return this.http.get<INews>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Cria uma nova notícia
   * @param news - Dados da notícia (sem ID)
   * @returns Observable<News>
   */
  createNews(news: FormData): Observable<INews> {
    return this.http.post<INews>(this.apiUrl, news)
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
  updateNews(id: number, news: Partial<INews>): Observable<INews> {
    return this.http.put<INews>(`${this.apiUrl}/${id}`, news)
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
  getFeaturedNews(): Observable<INews[]> {
    return this.http.get<INews[]>(`${this.apiUrl}/featured`)
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
    news: INews[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.http.get<{
      news: INews[];
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