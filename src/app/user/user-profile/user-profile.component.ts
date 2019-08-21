import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/shared/user.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails: User;
  constructor(private userService: UserService, private router: Router, public translate: TranslateService) {
  }

  ngOnInit() {
    this.userDetails = this.userService.getUserinfo();
    if (this.userDetails == null) {
      this.router.navigateByUrl('/userprofile');
    }
    // console.log(this.userDetails);
  }

  onLogout() {
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }

  loginAsRoleLL(role: any) {
    this.userService.setRole(role);
    this.router.navigate(['/dashboard-LLtags']);
  }

  changeLang(lang: string) {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang(lang);
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(lang);
    this.userService.setLang(lang);
  }

}
