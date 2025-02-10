import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Request } from '../interfaces/request.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
    
    private apiUrl = 'http://localhost:3000/requests';
    private contity : number | undefined;

    constructor(private http: HttpClient) {}

    getRequests(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    addRequest(request: Request): Observable<any> {
        return this.http.post(this.apiUrl, request);
    }

    updateRequest(request: Request): Observable<any>{
        return this.http.put(`${this.apiUrl}/${request.id}` , request);
    }

    deleteRequest(id: string): Observable<any>{
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    getRequestById(requestId: string): Observable<any>{
        return this.http.get(`${this.apiUrl}/${requestId}`);
    }

    approveRequest(requestId: string): Observable<Request> {
        
        return this.getRequestById(requestId).pipe(
            switchMap(request => {
                request.status = 'validated';
                const weightKg = request.weight / 1000;
                let points = 0;
                switch(request.type.toLowerCase()) {    
                    case 'plastique': points = weightKg * 2; break;
                    case 'verre': points = weightKg * 1; break;
                    case 'papier': points = weightKg * 1; break;
                    case 'métal': points = weightKg * 5; break;
                  }
                const userEmail = localStorage.getItem('recyclehub_users');
                if (userEmail) {
                    const users = JSON.parse(userEmail);
                    const user = users.find((u: any) => u.email === request.user_email);
                    if (user) {
                        user.points = (user.points || 0) + points;
                        localStorage.setItem('recyclehub_users', JSON.stringify(users));
                    }
                }
                return this.updateRequest(request);
            })
        );
    }
    
    rejectRequest(requestId: string): Observable<Request> {
        return this.getRequestById(requestId).pipe(
            switchMap(request => {
                request.status = 'rejected';
                return this.updateRequest(request);
            })
        );
    }
}
