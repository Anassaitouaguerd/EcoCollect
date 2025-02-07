import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
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
          mergeMap(() =>
            this.requestService.getRequests().pipe( 
              map(requests => RequestActions.loadRequestsSuccess({ requests }))
            )
          )
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
      
}