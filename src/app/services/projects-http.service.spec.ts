import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectsHttpService } from './projects-http.service';
import { Project } from './projects.service';

describe('ProjectsHttpService', () => {
  let service: ProjectsHttpService;
  let httpMock: HttpTestingController;

  const mockProject: Project = {
    id: 1,
    image: 'test-image.png',
    title: 'Test Project',
    date: '01 de Janeiro de 2025',
    description: 'Test description'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectsHttpService]
    });
    service = TestBed.inject(ProjectsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all projects', () => {
    const mockProjects: Project[] = [mockProject];

    service.getProjects().subscribe(projects => {
      expect(projects).toEqual(mockProjects);
    });

    const req = httpMock.expectOne('https://api.sementes-amazonia.com/projects');
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);
  });

  it('should fetch project by id', () => {
    service.getProjectById(1).subscribe(project => {
      expect(project).toEqual(mockProject);
    });

    const req = httpMock.expectOne('https://api.sementes-amazonia.com/projects/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProject);
  });

  it('should create a new project', () => {
    const newProject = {
      image: 'new-image.png',
      title: 'New Project',
      date: '02 de Janeiro de 2025',
      description: 'New description'
    };

    service.createProject(newProject).subscribe(project => {
      expect(project).toEqual(mockProject);
    });

    const req = httpMock.expectOne('https://api.sementes-amazonia.com/projects');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProject);
    req.flush(mockProject);
  });

  it('should update a project', () => {
    const updates = { title: 'Updated Project' };

    service.updateProject(1, updates).subscribe(project => {
      expect(project).toEqual(mockProject);
    });

    const req = httpMock.expectOne('https://api.sementes-amazonia.com/projects/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updates);
    req.flush(mockProject);
  });

  it('should delete a project', () => {
    service.deleteProject(1).subscribe();

    const req = httpMock.expectOne('https://api.sementes-amazonia.com/projects/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should fetch featured projects', () => {
    const mockProjects: Project[] = [mockProject];

    service.getFeaturedProjects().subscribe(projects => {
      expect(projects).toEqual(mockProjects);
    });

    const req = httpMock.expectOne('https://api.sementes-amazonia.com/projects/featured');
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);
  });

  it('should fetch projects with pagination', () => {
    const mockResponse = {
      projects: [mockProject],
      total: 1,
      page: 1,
      limit: 10
    };

    service.getProjectsPaginated(1, 10).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://api.sementes-amazonia.com/projects?page=1&limit=10');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
