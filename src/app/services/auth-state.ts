import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {

  private loggedInSubject = new BehaviorSubject<boolean>(this.readInitialState())
  isLoggedIn$: Observable<boolean> = this.loggedInSubject.asObservable()

  constructor(
        private router: Router,
  ) {}

  // Read initial state from LocalStorage
  private readInitialState(): boolean {
    const isConnected = localStorage.getItem('isConnected') === 'true';
    const token = localStorage.getItem('accessToken');
    return isConnected && !!token;
  }

  // Call after successfull login or register
  setLoggedIn(accessToken: string, refreshToken: string, username: string) {
    localStorage.setItem('isConnected', 'true');
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('username', username)
    this.loggedInSubject.next(true);
  }

  // Call to log out
  logout() {
    localStorage.removeItem('isConnected');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    this.loggedInSubject.next(false);
    this.router.navigateByUrl('/auth')
  }

}
