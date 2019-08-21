import { Component, OnInit } from '@angular/core';
import { rc_cat } from '../shared/rc-cat.module';
import { RcCatService } from '../shared/rc-cat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from '../shared/dashboard.service';
import { rc_format } from '../shared/rc-format.module';
import { rc_tag } from '../shared/rc-tag.module';
import { RcFormatService } from '../shared/rc-format.service';
import { RcTagService } from '../shared/rc-tag.service';

@Component({
  selector: 'app-dashboard-llcats',
  templateUrl: './dashboard-llcats.component.html',
  styleUrls: ['./dashboard-llcats.component.css']
})
export class DashboardLLCatsComponent implements OnInit {
  catid: any;
  orginalcats: any[];
  tagid: any;
  formatid: string;
  orginaltags: any[];
  orginalformats: any[];
  formatcurrent: rc_format = { formattitle: '', role: 'LL', _id: '', priority: 1, type: '', trashstatus: 0 };
  tagcurrent: rc_tag = { tagtitle: '', role: 'LL', _id: '', priority: 1, type: '', trashstatus: 0 };
  // tslint:disable-next-line: no-shadowed-variable
  // tslint:disable-next-line: max-line-length
  constructor(private RcFormatService: RcFormatService, private DashboardService: DashboardService, private RcTagService: RcTagService, private RcCatService: RcCatService, private router: Router, private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.tagid = this.route.snapshot.params.tagid;
    this.formatid = this.route.snapshot.params.formatid;
    this.BindTags();
    this.BindFormats();
    this.BindCats();
  }

  GotBackToTags() {
    this.router.navigate(['/dashboard-LLtags/']);
  }

  GotBackToFormats() {
    this.router.navigate(['/dashboard-LLformats/' + this.tagid]);
  }

  BindTags() {
    this.orginaltags = [];
    this.RcTagService.getData('rc_tag').subscribe(
      list => {
        this.orginaltags = list as [rc_tag];
        this.orginalcats.sort((a, b) => a.priority < b.priority ? -1 : 1);
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
        this.orginalformats.forEach(format => {
          if (format._id === this.formatid) {
            this.formatcurrent = format;
          }
        });
        // console.log(this.orginalformats);
      });
  }

  BindCats() {
    this.orginalcats = [];
    this.RcCatService.getData('rc_cat').subscribe(
      list => {
        this.orginalcats = list as [rc_cat];
        // console.log(this.orginalcats);
      });
  }

  GotToCats(el) {
    // console.log(el);
    this.DashboardService.CatShare = el;
    this.router.navigate(['/dashboard-llresources/' + this.tagid + '/' + this.formatid + '/' + el._id + '/0/rc']);
  }
}
