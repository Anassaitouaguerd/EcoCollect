import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { deleteRequest } from '../../store/request.actions';

@Component({
  selector: 'app-delete-request-modale',
  standalone: true,
  imports: [],
  templateUrl: './delete-request-modale.component.html',
  styleUrl: './delete-request-modale.component.css'
})
export class DeleteRequestModaleComponent {

  public requestId: string | undefined;

  constructor(
    public activeModal: NgbActiveModal , private store: Store) {
  }

  confirmDelete(){

    if (this.requestId !== undefined) {
      this.store.dispatch(deleteRequest({ id: this.requestId }));
    }
          
    this.activeModal.close();
  }
}
