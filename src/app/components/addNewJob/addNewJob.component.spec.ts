import { ComponentFixture, TestBed } from '@angular/core/testing';

import { addNewJob } from './addNewJob.component';

describe('UserinputComponent', () => {
  let component: addNewJob;
  let fixture: ComponentFixture<addNewJob>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ addNewJob ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(addNewJob);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
