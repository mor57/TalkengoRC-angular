import { Component, OnInit } from '@angular/core';
import { RcTagService } from '../shared/rc-tag.service';
import { rc_tag } from '../shared/rc-tag.module';
import { Router } from '@angular/router';
import { DashboardService } from '../shared/dashboard.service';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-dashboard-lltags',
  templateUrl: './dashboard-lltags.component.html',
  styleUrls: ['./dashboard-lltags.component.css']
})
export class DashboardLLTagsComponent implements OnInit {
  orginaltags: any[];

  // tslint:disable-next-line: no-shadowed-variable
  // tslint:disable-next-line: max-line-length
  constructor(public RcTagService: RcTagService, public DashboardService: DashboardService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.BindTags();
  }

  GotBackToTags() {
    this.router.navigate(['/dashboard-LLtags/']);
  }

  BindTags() {
    this.orginaltags = [];
    this.RcTagService.getDatahasresource('rc_tag').subscribe(
      list => {
        this.orginaltags = list as [rc_tag];
        this.orginaltags = this.orginaltags
          .filter(res => (res.trashstatus === 0 || res.trashstatus === undefined) && res.resourceCount > 0);
        this.orginaltags.sort((a, b) => a.priority < b.priority ? -1 : 1);
        if (this.orginaltags.length === 0) {
          this.GotToFormat({ _id: 0 });
        }
        // console.log(this.orginaltags);
      });
  }

  GotToFormat(el) {
    // console.log(el);
    // this.DashboardService.TagShare = el;
    this.router.navigate(['/dashboard-LLformats/' + el._id]);
  }
}
