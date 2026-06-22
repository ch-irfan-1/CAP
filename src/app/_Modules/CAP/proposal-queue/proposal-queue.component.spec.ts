import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalQueueComponent } from './proposal-queue.component';

describe('ProposalQueueComponent', () => {
  let component: ProposalQueueComponent;
  let fixture: ComponentFixture<ProposalQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalQueueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
