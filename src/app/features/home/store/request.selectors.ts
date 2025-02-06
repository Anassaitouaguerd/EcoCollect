import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RequestState } from './request.reducer';
import * as fromRequest from './request.reducer';

export const selectRequestState = createFeatureSelector<RequestState>('requests');

export const selectAllRequests = createSelector(
  selectRequestState,
  fromRequest.selectAll
);

export const selectRequestLoading = createSelector(
  selectRequestState,
  (state: RequestState) => state.loading
);

export const selectRequestError = createSelector(
  selectRequestState,
  (state: RequestState) => state.error
);