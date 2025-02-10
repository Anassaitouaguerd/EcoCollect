import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRequestModaleComponent } from './delete-request-modale.component';

describe('DeleteRequestModaleComponent', () => {
  let component: DeleteRequestModaleComponent;
  let fixture: ComponentFixture<DeleteRequestModaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteRequestModaleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteRequestModaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
