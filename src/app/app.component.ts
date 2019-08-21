import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from './shared/user.service';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/bufferCount';
// import { filter, pairwise } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // @ViewChild('sidenav', { static: true }) sidenav: ElementRef;
  title = 'TalkEngO';

  constructor(public user: UserService, private router: Router, public translate: TranslateService) {
    const browserLang = translate.getBrowserLang();
    let lang = browserLang.match(/en|fr/) ? browserLang : 'en';
    const lslang = user.getLang();
    if (lslang !== undefined) {
      lang = lslang;
    }
    translate.use(lang);

    this.router.events
      .filter(e => e instanceof RoutesRecognized)
      .pairwise()
      .subscribe((e: any[]) => {
        console.log('referrer', e[0].urlAfterRedirects);
      });
  }

  changeLang(lang: string) {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang(lang);
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(lang);
    this.user.setLang(lang);
  }

}
