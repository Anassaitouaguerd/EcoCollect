import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestService } from '../../../../services/request.service';
import { Observable } from 'rxjs';
import { Request } from '../../../../interfaces/request.interface';
import { Store } from '@ngrx/store';
import { updateRequest } from '../../store/request.actions';

@Component({
  selector: 'app-update-request-modal',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './update-request-modal.component.html',
  styleUrls: ['./update-request-modal.component.css']
})
export class UpdateRequestModalComponent implements OnInit {
  updateRequestForm: FormGroup;
  public requestId: string | undefined;
  public requestStatus: string | undefined;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private store: Store,
    private requestService: RequestService
  ) {
    this.updateRequestForm = this.fb.group({
      type: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(1000)]],
      date: ['', Validators.required],
      timeSlot: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    
    this.prefillForm();
  }

  prefillForm(): void {
    if (this.requestId) {
      this.requestService.getRequestById(this.requestId).subscribe(
        (data) => {
          if (data?.type) {
            this.updateRequestForm.patchValue({ type: data.type, weight: data.weight , date: data.date , timeSlot: data.timeSlot });            
          }
        }
      )
    } else {
      console.error('Request ID is undefined');
    }
    
  }

  onUpdateSubmit(event: Event): void {
    event.preventDefault();
    if (this.updateRequestForm.valid) {
      
      const updatedRequest = {
        ...this.updateRequestForm.value,
        user_email: this.getUserEmail(),
        id: this.requestId,
        status: this.requestStatus
      }
      console.log('Updated Request:', updatedRequest);
      
      this.store.dispatch(updateRequest({request: updatedRequest}));

      this.activeModal.close(updatedRequest);
    }
  }

  getUserEmail(): string{
    return localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).email : '';
  }
}