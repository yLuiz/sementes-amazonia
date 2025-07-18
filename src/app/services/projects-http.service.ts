import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiConfig } from '../config/api.config';
import { Project } from './projects.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsHttpService {
  private http = inject(HttpClient);

  private readonly apiUrl = apiConfig.projects.base;

  /**
   * Busca todos os projetos da API
   * @returns Observable<Project[]>
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Busca um projeto específico por ID
   * @param id - ID do projeto
   * @returns Observable<Project>
   */
  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Cria um novo projeto
   * @param project - Dados do projeto (sem ID)
   * @returns Observable<Project>
   */
  createProject(project: Omit<Project, 'id'>): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Atualiza um projeto existente
   * @param id - ID do projeto
   * @param project - Dados atualizados do projeto
   * @returns Observable<Project>
   */
  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Remove um projeto
   * @param id - ID do projeto
   * @returns Observable<boolean>
   */
  deleteProject(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        map(() => true),
        catchError(this.handleError)
      );
  }

  /**
   * Busca projetos em destaque
   * @returns Observable<Project[]>
   */
  getFeaturedProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/featured`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Busca projetos com paginação
   * @param page - Número da página
   * @param limit - Quantidade de itens por página
   * @returns Observable<{projects: Project[], total: number, page: number, limit: number}>
   */
  getProjectsPaginated(page: number = 1, limit: number = 10): Observable<{
    projects: Project[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.http.get<{
      projects: Project[];
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
    
    if (error.error instanceof ErrorEvent) {
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
