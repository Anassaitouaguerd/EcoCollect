import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Request } from '../../../interfaces/request.interface';
import * as RequestActions from './request.actions';

export interface RequestState extends EntityState<Request> {
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<Request> = createEntityAdapter<Request>();

export const initialState: RequestState = adapter.getInitialState({
  loading: false,
  error: null
});

export const requestReducer = createReducer(
  initialState,
  
  on(RequestActions.addRequest, (state) => ({
    ...state,
    loading: true
  })),
  
  on(RequestActions.addRequestSuccess, (state, { request }) => 
    adapter.addOne(request, { ...state, loading: false })
  ),
  
  on(RequestActions.addRequestFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false  
  })),
  
  on(RequestActions.loadRequests, (state) => ({
    ...state,
    loading: true
  })),
  
  on(RequestActions.loadRequestsSuccess, (state, { requests }) =>{
    console.log('Reducer received requests:', requests);
      return adapter.setAll(requests, { ...state, loading: false })
  }

  ),
  
  on(RequestActions.loadRequestsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();