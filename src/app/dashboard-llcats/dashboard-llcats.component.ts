import { Component, OnInit } from '@angular/core';
import { rc_cat } from '../shared/rc-cat.module';
import { RcCatService } from '../shared/rc-cat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from '../shared/dashboard.service';

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

  // tslint:disable-next-line: no-shadowed-variable
  // tslint:disable-next-line: max-line-length
  constructor(public RcCatService: RcCatService, public DashboardService: DashboardService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.tagid = this.route.snapshot.params.tagid;
    this.formatid = this.route.snapshot.params.formatid;
    this.BindCats();
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
    console.log(el);
    this.DashboardService.CatShare = el;
    this.router.navigate(['/dashboard-LLresources/' + this.tagid + '/' + this.formatid + '/' + el._id + '/rc']);
  }
}
