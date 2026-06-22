import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignToVOComponent } from './assign-to-vo.component';

describe('AssignToVOComponent', () => {
  let component: AssignToVOComponent;
  let fixture: ComponentFixture<AssignToVOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignToVOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignToVOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
