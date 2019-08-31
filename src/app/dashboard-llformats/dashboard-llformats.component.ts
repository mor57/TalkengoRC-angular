import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RcFormatService } from '../shared/rc-format.service';
import { rc_format } from '../shared/rc-format.module';
import { DashboardService } from '../shared/dashboard.service';
import { rc_tag } from '../shared/rc-tag.module';
import { RcTagService } from '../shared/rc-tag.service';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-dashboard-llformats',
  templateUrl: './dashboard-llformats.component.html',
  styleUrls: ['./dashboard-llformats.component.css']
})
export class DashboardLLFormatsComponent implements OnInit {
  formatid: any;
  orginalformats: any[];
  tagid: any;
  orginaltags: any[];
  tagcurrent: rc_tag = { tagtitle: '', role: 'learner', _id: '', priority: 1, type: '', trashstatus: 0, resourceCount: 0 };

  // tslint:disable-next-line: no-shadowed-variable
  // tslint:disable-next-line: max-line-length
  constructor(public RcFormatService: RcFormatService, private RcTagService: RcTagService, public DashboardService: DashboardService, private router: Router, private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.tagid = this.route.snapshot.params.tagid;
    this.BindTags();
    this.BindFormats();
  }

  GotBackToTags() {
    this.router.navigate(['/dashboard-LLtags/']);
  }

  BindTags() {
    this.orginaltags = [];
    this.RcTagService.getDatahasresource('rc_tag').subscribe(
      list => {
        this.orginaltags = list as [rc_tag];
        this.orginaltags.forEach(tag => {
          if (tag._id === this.tagid) {
            this.tagcurrent = tag;
          }
        });
      });
  }

  BindFormats() {
    this.orginalformats = [];
    this.RcFormatService.getDatahasresource('rc_format').subscribe(
      list => {
        this.orginalformats = list as [rc_format];
        this.orginalformats.sort((a, b) => a.priority < b.priority ? -1 : 1);
        this.orginalformats = this.orginalformats
          .filter(res => (res.trashstatus === 0 || res.trashstatus === undefined) && res.resourceCount > 0);
        if (this.orginalformats.length === 0) {
          this.GotToCats({ _id: 0 });
        }
        // console.log(this.orginalformats);
      });
  }

  GotToCats(el) {
    // console.log(el);
    // this.DashboardService.FormatShare = el;
    this.router.navigate(['/dashboard-LLcats/' + this.tagid + '/' + el._id]);
  }
}
