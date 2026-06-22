import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleComponentConfigurationComponent } from './article-component-configuration.component';

describe('ArticleComponentConfigurationComponent', () => {
  let component: ArticleComponentConfigurationComponent;
  let fixture: ComponentFixture<ArticleComponentConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleComponentConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleComponentConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
