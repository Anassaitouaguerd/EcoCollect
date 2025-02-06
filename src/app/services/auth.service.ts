import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersKey = 'recyclehub_users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    this.initializeDefaultUsers();
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<void> {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      this.currentUserSubject.next(user);
      return of(undefined);
    }
    return throwError(() => new Error('Invalid credentials'));
  }

  register(userData: any): Observable<void> {
    const users = this.getUsers();
    
    if (users.some(u => u.email === userData.email)) {
      return throwError(() => new Error('Email already registered'));
    }

    const newUser: User = {
      ...userData,
      address: '',
      points: 0,
      requests: [],
      role: 'particulier'
    };

    users.push(newUser);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    }
    return of(undefined);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.usersKey) || '[]');
  }

  private initializeDefaultUsers() {
    if (!localStorage.getItem(this.usersKey)) {
      const collector = {
        email: 'collector@recyclehub.com',
        password: 'collector123',
        firstName: 'Eco',
        lastName: 'Collector',
        address: '123 Green Street',
        role: 'collecteur'
      };
      if (typeof localStorage !== 'undefined') {
       localStorage.setItem(this.usersKey, JSON.stringify([collector]));
      }
    }
  }
}