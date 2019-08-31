import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RcCatService {

  constructor(private http: HttpClient, private userService: UserService
  ) { }

  // tslint:disable-next-line: variable-name
  rc_catList: MatTableDataSource<any>;

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    id: new FormControl(''),
    cattitle: new FormControl('', [Validators.required, Validators.minLength(3)]),
    type: new FormControl('', Validators.required),
    priority: new FormControl(1, Validators.required),
    role: new FormControl('learner', [Validators.required, Validators.minLength(2)])
  });

  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      id: '',
      cattitle: '',
      type: '',
      priority: 1,
      role: 'learner',
    });
  }

  public getData = (route: string) => {
    return this.http.get(this.createCompleteRoute(route, environment.apiBaseUrl));
  }

  public getDatahasresource = (route: string) => {
    return this.http.get(this.createCompleteRoute(route + '/hasresource/' + this.userService.getRole(), environment.apiBaseUrl));
  }

  public create = (route: string, body) => {
    if (body.id === null || body.id === '') {
      return this.http.post(this.createCompleteRoute(route, environment.apiBaseUrl), body);
    } else {
      return this.http.put(this.createCompleteRoute(route, environment.apiBaseUrl) + '/' + body.id, body);
    }
  }

  public update = (route: string, body) => {
    return this.http.put(this.createCompleteRoute(route, environment.apiBaseUrl), body);
  }

  public delete = (route: string, id) => {
    return this.http.delete(this.createCompleteRoute(route, environment.apiBaseUrl) + '/' + id);
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }

}
