import { TestBed } from '@angular/core/testing';
import { ProjectsService, Project } from './projects.service';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all projects', (done) => {
    service.getProjects().subscribe(projects => {
      expect(projects).toBeTruthy();
      expect(projects.length).toBe(3);
      expect(projects[0].title).toBe('Projeto 1');
      done();
    });
  });

  it('should return project by id', (done) => {
    service.getProjectById(1).subscribe(project => {
      expect(project).toBeTruthy();
      expect(project?.title).toBe('Projeto 1');
      done();
    });
  });

  it('should return undefined for non-existent project', (done) => {
    service.getProjectById(999).subscribe(project => {
      expect(project).toBeUndefined();
      done();
    });
  });

  it('should return featured projects', (done) => {
    service.getFeaturedProjects().subscribe(projects => {
      expect(projects).toBeTruthy();
      expect(projects.length).toBe(3);
      done();
    });
  });

  it('should add a new project', (done) => {
    const newProject = {
      image: 'test-image.png',
      title: 'Test Project',
      date: '01 de Janeiro de 2025',
      description: 'Test description'
    };

    service.addProject(newProject).subscribe(project => {
      expect(project).toBeTruthy();
      expect(project.id).toBeTruthy();
      expect(project.title).toBe('Test Project');
      done();
    });
  });

  it('should update existing project', (done) => {
    const updates = { title: 'Updated Project' };
    
    service.updateProject(1, updates).subscribe(project => {
      expect(project).toBeTruthy();
      expect(project?.title).toBe('Updated Project');
      done();
    });
  });

  it('should return null when updating non-existent project', (done) => {
    service.updateProject(999, { title: 'Updated' }).subscribe(project => {
      expect(project).toBeNull();
      done();
    });
  });

  it('should delete project', (done) => {
    service.deleteProject(1).subscribe(result => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should return false when deleting non-existent project', (done) => {
    service.deleteProject(999).subscribe(result => {
      expect(result).toBe(false);
      done();
    });
  });
});
