import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../config/api.config';
import { ProjectsHttpService } from './projects-http.service';

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
  private projectsHttpService = inject(ProjectsHttpService);
  
  // TODO: Integrar com ProjectsHttpService quando a API estiver pronta
  // Por enquanto, utilizando apenas dados mockados pra não gastar onda de requiqisição que não existe

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

  constructor() { }

  /**
   * Retorna todos os projetos
   * @returns Observable<Project[]>
   */
  getProjects(): Observable<Project[]> {
    if (environment.useMockData) {
      return of(this.mockProjects);
    } else {
      return this.projectsHttpService.getProjects();
    }
  }

  /**
   * Retorna um projeto específico pelo ID
   * @param id - ID do projeto
   * @returns Observable<Project | undefined>
   */
  getProjectById(id: number): Observable<Project | undefined> {
    if (environment.useMockData) {
      const project = this.mockProjects.find(p => p.id === id);
      return of(project);
    } else {
      return this.projectsHttpService.getProjectById(id);
    }
  }

  /**
   * Retorna os projetos em destaque (primeiros 3)
   * @returns Observable<Project[]>
   */
  getFeaturedProjects(): Observable<Project[]> {
    if (environment.useMockData) {
      return of(this.mockProjects.slice(0, 3));
    } else {
      return this.projectsHttpService.getFeaturedProjects();
    }
  }

  /**
   * Adiciona um novo projeto
   * @param project - Dados do projeto (sem ID)
   * @returns Observable<Project>
   */
  addProject(project: Omit<Project, 'id'>): Observable<Project> {
    if (environment.useMockData) {
      const newProject: Project = {
        ...project,
        id: Math.max(...this.mockProjects.map(p => p.id)) + 1
      };
      this.mockProjects.push(newProject);
      return of(newProject);
    } else {
      return this.projectsHttpService.createProject(project);
    }
  }

  /**
   * Atualiza um projeto existente
   * @param id - ID do projeto
   * @param project - Dados atualizados do projeto
   * @returns Observable<Project | null>
   */
  updateProject(id: number, project: Partial<Project>): Observable<Project | null> {
    if (environment.useMockData) {
      const index = this.mockProjects.findIndex(p => p.id === id);
      if (index !== -1) {
        this.mockProjects[index] = { ...this.mockProjects[index], ...project };
        return of(this.mockProjects[index]);
      }
      return of(null);
    } else {
      return this.projectsHttpService.updateProject(id, project);
    }
  }

  /**
   * Remove um projeto
   * @param id - ID do projeto
   * @returns Observable<boolean>
   */
  deleteProject(id: number): Observable<boolean> {
    if (environment.useMockData) {
      const index = this.mockProjects.findIndex(p => p.id === id);
      if (index !== -1) {
        this.mockProjects.splice(index, 1);
        return of(true);
      }
      return of(false);
    } else {
      return this.projectsHttpService.deleteProject(id);
    }
  }
}
