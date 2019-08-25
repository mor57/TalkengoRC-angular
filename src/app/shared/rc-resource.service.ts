import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RcResourceService {

  constructor(private http: HttpClient, private userService: UserService,
  ) { }

  // tslint:disable-next-line: variable-name
  rc_resourceList: MatTableDataSource<any>;

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    id: new FormControl(''),
    resourcetitle: new FormControl('', [Validators.required, Validators.minLength(3)]),
    resourcefile: new FormControl(null),
    type: new FormControl('pdf', Validators.required),
    typestr: new FormControl(null),
    tags: new FormControl([]),
    cats: new FormControl([]),
    topics: new FormControl([]),
    levels: new FormControl([]),
    access: new FormControl('In resource center', Validators.required),
    accesspermission: new FormControl('Registered only', Validators.required),
    subject: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    priority: new FormControl(1, Validators.required),
    role: new FormControl('LL', [Validators.required, Validators.minLength(2)]),
    trashstatus: new FormControl(null),
    visitors: new FormControl([]),
    usagecount: new FormControl(null),
    raters: new FormControl([]),
    rate_sum: new FormControl(null)
  });

  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      id: '',
      resourcetitle: '',
      type: 'pdf',
      typestr: null,
      resourcefile: null,
      tags: [],
      cats: [],
      topics: [],
      levels: [],
      access: 'In resource center',
      accesspermission: 'Registered only',
      subject: '',
      description: '',
      priority: 1,
      role: 'LL',
      trashstatus: 0,
      visitors: [],
      usagecount: 0,
      raters: [],
      // tslint:disable-next-line: variable-name
      rate_sum: 0
    });
  }

  public getData = (route: string) => {
    if (this.userService.isLoggedIn()) {
      return this.http.get(this.createCompleteRoute(route, environment.apiBaseUrl));
    } else {
      return this.http.get(this.createCompleteRoute(route + '/free', environment.apiBaseUrl));
    }
  }

  public create = (route: string, body) => {
    let res;
    if (body.id === null || body.id === '') {
      res = this.http.post(this.createCompleteRoute(route, environment.apiBaseUrl), body);
    } else {
      res = this.http.put(this.createCompleteRoute(route, environment.apiBaseUrl) + '/' + body.id, body);
    }
    return res;
  }

  public update = (route: string, body) => {
    return this.http.put(this.createCompleteRoute(route, environment.apiBaseUrl), body);
  }

  public updatevisitors = (route: string, body) => {
    const userinfo = this.userService.getUserinfo();
    return this.http.put(this.createCompleteRoute(route, environment.apiBaseUrl) + '/' + body.id + '/' + userinfo.id, body);
  }

  public delete = (route: string, id) => {
    return this.http.delete(this.createCompleteRoute(route, environment.apiBaseUrl) + '/' + id);
  }

  public uploadFile(body) {
    const formData = new FormData();
    formData.append('resourcefile', body.resourcefile);
    return this.http.post(this.createCompleteRoute('rc_upload', environment.apiBaseUrl) + '/' + body.id, formData);
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }

}
