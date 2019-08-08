import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RcFormatService } from '../shared/rc-format.service';
import { rc_format } from '../shared/rc-format.module';
import { DashboardService } from '../shared/dashboard.service';

@Component({
  selector: 'app-dashboard-llformats',
  templateUrl: './dashboard-llformats.component.html',
  styleUrls: ['./dashboard-llformats.component.css']
})
export class DashboardLLFormatsComponent implements OnInit {
  formatid: any;
  orginalformats: any[];
  tagid: any;

  // tslint:disable-next-line: no-shadowed-variable
  // tslint:disable-next-line: max-line-length
  constructor(public RcFormatService: RcFormatService, public DashboardService: DashboardService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.tagid = this.route.snapshot.params.tagid;
    this.BindFormats();
  }

  BindFormats() {
    this.orginalformats = [];
    this.RcFormatService.getData('rc_format').subscribe(
      list => {
        this.orginalformats = list as [rc_format];
        // console.log(this.orginalformats);
      });
  }

  GotToCats(el) {
    console.log(el);
    this.DashboardService.FormatShare = el;
    this.router.navigate(['/dashboard-LLcats/' + this.tagid + '/' + el._id]);
  }
}
