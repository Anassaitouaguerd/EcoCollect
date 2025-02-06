import { createAction, props } from "@ngrx/store";
import { Request } from "../../../interfaces/request.interface";


export const addRequest = createAction(
  '[Request] add Request' , props<{request: Request}>()
);

export const addRequestSuccess  = createAction(
  '[Request] add Request Success' , props<{request: Request}>()
);

export const addRequestFailure  = createAction(
  '[Request] add Request Failure' , props<{error: any}>()
);

export const loadRequests  = createAction('[Request] Load Requests');

export const loadRequestsSuccess = createAction(
  '[Request] Load Requests Success', props<{ requests: Request[] }>()
);
  
export const loadRequestsFailure = createAction(
  '[Request] Load Requests Failure', props<{ error: any }>()
);