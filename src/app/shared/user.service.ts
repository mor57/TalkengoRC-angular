import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from './user.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User = {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    role: ''
  };

  noAuthHeader = { headers: new HttpHeaders({ NoAuth: 'True' }) };

  constructor(private http: HttpClient, private router: Router, public translate: TranslateService) { }

  // HttpMethods

  postUser(user: User) {
    user.username = user.email;
    return this.http.post(environment.apiBaseUrl + '/register', user, this.noAuthHeader);
  }

  login(authCredentials) {
    const user = this.http.post(environment.apiBaseUrl + '/login', authCredentials, this.noAuthHeader);
    return user;
    // return this.http.post(environment.apiBaseUrl + '/rc_tag', authCredentials, this.noAuthHeader);
  }

  // Helper Methods

  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + '/userProfile');
  }

  getUserinfo() {
    let userinfo = null;
    if (localStorage.getItem('userinfo')) {
      userinfo = JSON.parse(localStorage.getItem('userinfo'));
    }
    return userinfo;
  }

  setUserinfo(userinfo: any) {
    localStorage.setItem('userinfo', JSON.stringify(userinfo));
    this.setRole('admin');
  }

  setRole(role: any) {
    localStorage.setItem('role', role);
  }

  getRole() {
    return localStorage.getItem('role');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getLang() {
    return localStorage.getItem('lang');
  }

  setLang(token: string) {
    localStorage.setItem('lang', token);
  }

  isResourceIdVisited(resourceId: string) {
    let VisitedResources = JSON.parse(this.getVisitedResources());
    let result = [];
    if (VisitedResources !== null) {
      result = VisitedResources.filter(rid => rid === resourceId);
    } else {
      VisitedResources = [];
    }
    if (result.length === 0) {
      VisitedResources.push(resourceId);
      localStorage.setItem('VisitedResources', JSON.stringify(VisitedResources));
      return false;
    } else {
      return true;
    }
  }

  getVisitedResources() {
    return localStorage.getItem('VisitedResources');
  }

  deleteToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('userinfo');
    localStorage.removeItem('role');
  }

  getUserPayload() {
    const token = this.getToken();
    if (token) {
      // tslint:disable-next-line: prefer-const
      let userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    } else {
      return null;
    }
  }

  isLoggedIn() {
    const userPayload = this.getUserPayload();
    if (userPayload) {
      return userPayload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  handleAuthentication() {
    if (this.getUserPayload()) {
      window.location.hash = '';
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  logout() {
    // Remove tokens and expiry time from localStorage
    this.deleteToken();
    // Go back to the home route
    this.router.navigate(['/login']);
  }

  translateKey(key: any) {
    return this.translate.get(key);
  }
}
