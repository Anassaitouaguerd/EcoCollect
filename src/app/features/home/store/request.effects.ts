import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RequestService } from '../../../services/request.service';
import * as RequestActions from './request.actions';
import { mergeMap, map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class RequestEffects {
    constructor(private actions$: Actions, private requestService: RequestService) {

    }

    loadRequests$ = createEffect(() =>
        this.actions$.pipe(
          ofType(RequestActions.loadRequests),
          mergeMap(() => {
            const userEmail =  localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).email : '';
            return this.requestService.getRequests().pipe( 
              map(requests => requests.filter((request: { user_email: any; }) => request.user_email === userEmail)),
              map(filteredRequests => RequestActions.loadRequestsSuccess({ requests: filteredRequests }))
            );
          })
        )
      );

      addRequest$ = createEffect(() =>
        this.actions$.pipe(
          ofType(RequestActions.addRequest), 
          mergeMap(({ request }) =>
            this.requestService.addRequest(request).pipe(
              map((savedRequest) => RequestActions.addRequestSuccess({ request: savedRequest })),
              catchError((error) => of(RequestActions.addRequestFailure({ error })))
            )
          )
        )
      );
      
      updateRequest$ = createEffect(() =>
        this.actions$.pipe(
          ofType(RequestActions.updateRequest),
          mergeMap(({ request }) =>
            this.requestService.updateRequest(request).pipe(
              map((updatedRequest) => 
                RequestActions.updateRequestSuccess({ request: updatedRequest })
              ),
              catchError((error) => 
                of(RequestActions.updateRequestFailure({ error }))
              )
            )
          )
        )
      );
      
      deleteRequest$ = createEffect(() =>
        this.actions$.pipe(
          ofType(RequestActions.deleteRequest),
          mergeMap(({ id }) =>
            this.requestService.deleteRequest(id.toString()).pipe(
              map(() => RequestActions.deleteRequestSuccess({ id })),
              catchError((error) => 
                of(RequestActions.deleteRequestFailure({ error }))
              )
            )
          )
        )
      );
}