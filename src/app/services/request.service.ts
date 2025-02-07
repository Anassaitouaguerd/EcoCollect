import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, map, Observable } from 'rxjs';
import { Request } from '../interfaces/request.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
    
    private apiUrl = 'http://localhost:3000/requests'; // Chemin du fichier JSON

    constructor(private http: HttpClient) {}

    getRequests(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    addRequest(request: Request): Observable<any> {
        return this.http.post('http://localhost:3000/requests', request);
    }

    
}
