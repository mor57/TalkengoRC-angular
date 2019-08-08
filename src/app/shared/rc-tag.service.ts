import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RcTagService {

  constructor(private http: HttpClient, private userService: UserService
  ) { }

  // constructor(private firebase: AngularFireDatabase, private datePipe: DatePipe) { }
  // tslint:disable-next-line: variable-name
  rc_tagList: MatTableDataSource<any>;

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    id: new FormControl(''),
    tagtitle: new FormControl('', [Validators.required, Validators.minLength(3)]),
    priority: new FormControl(1, Validators.required),
    role: new FormControl('LL', [Validators.required, Validators.minLength(2)])
  });

  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      id: '',
      tagtitle: '',
      priority: 1,
      role: 'LL',
    });
  }

  public getData = (route: string) => {
    return this.http.get(this.createCompleteRoute(route, environment.apiBaseUrl));
  }

  public create = (route: string, body) => {
    if (body.id === null) {
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

  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      // headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + this.userService.getToken() }),
    };
  }
}
