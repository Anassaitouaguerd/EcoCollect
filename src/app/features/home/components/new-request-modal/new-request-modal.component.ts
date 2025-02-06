import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Request } from '../../../../interfaces/request.interface';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { addRequest, addRequestSuccess } from '../../store/request.actions';
import { selectAllRequests } from '../../store/request.selectors';
import { tap } from 'rxjs';

@Component({
  selector: 'app-new-request-modal',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './new-request-modal.component.html',
  styleUrls: ['./new-request-modal.component.css']
})
export class NewRequestModalComponent {
  requestForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private store: Store
  ) {
    this.requestForm = this.fb.group({
      type: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(1000)]],
      date: ['', Validators.required],
      timeSlot: ['', Validators.required]
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    
    // Mark all fields as touched to trigger validation messages
    Object.keys(this.requestForm.controls).forEach(key => {
      const control = this.requestForm.get(key);
      control?.markAsTouched();
    });

  
    if (this.requestForm.valid) {
      const newRequest = {
        ...this.requestForm.value,
        id: this.generateUniqueId(),
        status: 'en attente'
      };
      this.store.dispatch(addRequestSuccess({request: newRequest}))

      setTimeout(() => {
        this.store.select(selectAllRequests)
          .pipe(tap(requests => console.log('Current requests in store:', requests)))
          .subscribe();
      }, 100);
      this.activeModal.close(newRequest);
    }
  }

  generateUniqueId(): string {
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 11);
  }
}