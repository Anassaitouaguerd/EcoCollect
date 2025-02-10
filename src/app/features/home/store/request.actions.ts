import { createAction, props } from "@ngrx/store";
import { Request } from "../../../interfaces/request.interface";

// part of add actions
export const addRequest = createAction(
  '[Request] add Request' , props<{request: Request}>()
);

export const addRequestSuccess  = createAction(
  '[Request] add Request Success' , props<{request: Request}>()
);

export const addRequestFailure  = createAction(
  '[Request] add Request Failure' , props<{error: any}>()
);

// part of update actions
export const updateRequest = createAction(
  '[Request] update Request' , props<{request: Request}>()
);

export const updateRequestSuccess  = createAction(
  '[Request] update Request Success' , props<{request: Request}>()
);

export const updateRequestFailure  = createAction(
  '[Request] update Request Failure' , props<{error: any}>()
);

// part of delete actions
export const deleteRequest = createAction(
  '[Request] Delete Request',
  props<{id: string | number}>()
);

export const deleteRequestSuccess = createAction(
  '[Request] Delete Request Success',
  props<{id: string | number}>()
);

export const deleteRequestFailure = createAction(
  '[Request] Delete Request Failure',
  props<{error: any}>()
);

// part of load data actions 
export const loadRequests  = createAction('[Request] Load Requests');

export const loadRequestsSuccess = createAction(
  '[Request] Load Requests Success', props<{ requests: Request[] }>()
);
  
export const loadRequestsFailure = createAction(
  '[Request] Load Requests Failure', props<{ error: any }>()
);