import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { addRequest } from '../../store/request.actions';

import { RequestService } from '../../../../services/request.service';

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
    
    Object.keys(this.requestForm.controls).forEach(key => {
      const control = this.requestForm.get(key);
      control?.markAsTouched();
    });

  
    if (this.requestForm.valid) {
      const newRequest = {
        ...this.requestForm.value,
        id: this.generateUniqueId(),
        status: 'pending',
        user_email: this.getUserEmail()
      };

      this.store.dispatch(addRequest({request: newRequest}));

      this.activeModal.close(newRequest);
    }
  }

  generateUniqueId(): string {
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 11);
  }

  getUserEmail(): string{
    return localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).email : '';
  }
}