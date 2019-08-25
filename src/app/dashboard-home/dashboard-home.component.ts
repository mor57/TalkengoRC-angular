import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { RcCatService } from '../shared/rc-cat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { rc_cat } from '../shared/rc-cat.module';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  catid: any;
  orginalcats: any[];
  // tslint:disable-next-line: max-line-length
  constructor(public userService: UserService, private sanitizer: DomSanitizer, private RcCatService: RcCatService, private router: Router, private route: ActivatedRoute) { }
  apiBaseUrl: string = environment.apiBaseUrl;
  resourcefile: any;

  ngOnInit() {
    this.resourcefile = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiBaseUrl + '/rc_uploads/learner-tutorial.mp4#toolbar=0');
    this.BindCats();
    if (this.userService.getRole() === null) {
      this.userService.setRole('LL');
    }
  }

  BindCats() {
    this.orginalcats = [];
    this.RcCatService.getData('rc_cat').subscribe(
      list => {
        this.orginalcats = list as rc_cat[];
        // console.log(this.orginalcats);
      });
  }

  GotToCats(el) {
    // console.log(el);
    // this.DashboardService.CatShare = el;
    this.router.navigate(['/dashboard-llresources/0/0/' + el._id + '/0/rc']);
  }

  onRightClick() {
    return false;
  }
}
