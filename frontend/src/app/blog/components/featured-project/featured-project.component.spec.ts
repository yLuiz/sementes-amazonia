import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedProjectComponent } from './featured-project.component';

describe('FeaturedProjectComponent', () => {
  let component: FeaturedProjectComponent;
  let fixture: ComponentFixture<FeaturedProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedProjectComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), provideToastr(), provideNoopAnimations()],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeaturedProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
