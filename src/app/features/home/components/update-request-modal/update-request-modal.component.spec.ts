import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRequestModalComponent } from './update-request-modal.component';

describe('UpdateRequestModaleComponent', () => {
  let component: UpdateRequestModalComponent;
  let fixture: ComponentFixture<UpdateRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRequestModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
