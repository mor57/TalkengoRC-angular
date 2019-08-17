import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RcFormatService } from '../shared/rc-format.service';
import { rc_format } from '../shared/rc-format.module';
import { DashboardService } from '../shared/dashboard.service';
import { rc_tag } from '../shared/rc-tag.module';
import { RcTagService } from '../shared/rc-tag.service';

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
  tagcurrent: rc_tag = { tagtitle: '', role: 'LL', _id: '', priority: 1, type: '' };

  // tslint:disable-next-line: no-shadowed-variable
  // tslint:disable-next-line: max-line-length
  constructor(public RcFormatService: RcFormatService, private RcTagService: RcTagService, public DashboardService: DashboardService, private router: Router, private route: ActivatedRoute) { }

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
    this.RcTagService.getData('rc_tag').subscribe(
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
    this.RcFormatService.getData('rc_format').subscribe(
      list => {
        this.orginalformats = list as [rc_format];
        this.orginalformats.sort((a, b) => a.priority < b.priority ? -1 : 1);
        // console.log(this.orginalformats);
      });
  }

  GotToCats(el) {
    // console.log(el);
    this.DashboardService.FormatShare = el;
    this.router.navigate(['/dashboard-LLcats/' + this.tagid + '/' + el._id]);
  }
}
