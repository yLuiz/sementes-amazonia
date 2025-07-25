import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { apiConfig } from '../../config/api.config';


export interface IProjectPortugueseResponse {
  id: number,
  nome: string,
  resumo: string,
  imagemThumb: string,
  descricaoCompleta: string,
  createdAt: string,
  updatedAt: string,
}

export interface Project {
  id: number;
  image: string;
  title: string;
  date: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private mockProjects: Project[] = [
    {
      id: 1,
      image: '../../../assets/Image 1.png',
      title: 'Projeto 1',
      date: '31 de Maio de 2025',
      description: 'Descrição do Projeto 1. Este projeto visa promover a conservação da Amazônia através de práticas sustentáveis e educação ambiental.'
    },
    {
      id: 2,
      image: '../../../assets/Image 2.png',
      title: 'Projeto 2',
      date: '31 de Maio de 2025',
      description: 'Descrição do Projeto 2. Este projeto visa promover a conservação da Amazônia através de práticas sustentáveis e educação ambiental.'
    },
    {
      id: 3,
      image: '../../../assets/Image 3.png',
      title: 'Projeto 3',
      date: '31 de Maio de 2025',
      description: 'Descrição do Projeto 3. Este projeto visa promover a conservação da Amazônia através de práticas sustentáveis e educação ambiental.'
    }
  ];

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
  createProject(project: FormData): Observable<Project> {
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
