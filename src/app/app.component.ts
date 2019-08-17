import { Component } from '@angular/core';
import { UserService } from './shared/user.service';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/bufferCount';
import { filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TalkEngO';
  constructor(public user: UserService, private router: Router) {
    // user.handleAuthentication();
    // this.router.events
    //   //  .filter(e => e instanceof NavigationStart )
    //   .bufferCount(1, 1).subscribe(e => console.log(e[0]));
    this.router.events
      .filter(e => e instanceof RoutesRecognized)
      .pairwise()
      .subscribe((e: any[]) => {
        console.log('referrer', e[0].urlAfterRedirects);
      });
  }
}
