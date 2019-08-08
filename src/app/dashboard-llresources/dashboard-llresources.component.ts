import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { RcResourceService } from 'src/app/shared/rc-resource.service';
import { rc_resource } from 'src/app/shared/rc-resource.module';
import { NotificationService } from 'src/app/shared/notification.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { RcTagService } from '../shared/rc-tag.service';
import { RcCatService } from '../shared/rc-cat.service';
import { DashboardService } from '../shared/dashboard.service';
import { rc_cat } from '../shared/rc-cat.module';
import { rc_tag } from '../shared/rc-tag.module';
import { RcFormatService } from '../shared/rc-format.service';
import { rc_format } from '../shared/rc-format.module';

@Component({
  selector: 'app-dashboard-llresources',
  templateUrl: './dashboard-llresources.component.html',
  styleUrls: ['./dashboard-llresources.component.css']
})
export class DashboardLLResourcesComponent implements OnInit {
  tagid: any;
  tagcurrent: rc_tag;
  formatid: any;
  formatcurrent: rc_format;
  catid: any;
  catcurrent: rc_cat;
  position: any;
  ResourceTitle: string;
  orginaltags: any[];
  orginalcats: any[];
  orginalformats: any[];
  orginalresources: any[];
  resources: any[];
  // tslint:disable-next-line: no-shadowed-variable
  // tslint:disable-next-line: max-line-length
  constructor(private RcResourceService: RcResourceService, private RcFormatService: RcFormatService, private DashboardService: DashboardService, private RcTagService: RcTagService, private RcCatService: RcCatService, public dialog: MatDialog, private notificationService: NotificationService, private router: Router, private route: ActivatedRoute
  ) { }
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['resourcetitle', 'type', 'typestr', 'actions'];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  searchKey: string;
  apiBaseUrl: string = environment.apiBaseUrl;

  ngOnInit() {
    this.tagid = this.route.snapshot.params.tagid;
    this.formatid = this.route.snapshot.params.formatid;
    this.catid = this.route.snapshot.params.catid;
    this.position = this.route.snapshot.params.position;
    this.ResourceTitle = 'Resources';
    this.getFormat();
    this.BindTags();
    this.BindCats();
    this.loadresources();
  }

  GotBackToTags() {
    this.router.navigate(['/dashboard-LLtags/']);
  }

  GotBackToFormats() {
    this.router.navigate(['/dashboard-LLformats/' + this.tagid]);
  }

  GotBackToCats() {
    this.router.navigate(['/dashboard-LLcats/' + this.tagid + '/' + this.formatid]);
  }

  getFormat() {
    this.RcFormatService.getData('rc_format').subscribe(
      list => {
        this.orginalformats = list as [rc_format];
        this.orginalformats.forEach(format => {
          if (format._id === this.formatid) {
            this.formatcurrent = format;
          }
        });
      });
  }

  BindCats() {
    this.orginalcats = [];
    this.RcCatService.getData('rc_cat').subscribe(
      list => {
        this.orginalcats = list as [rc_cat];
        this.orginalcats.forEach(cat => {
          if (cat._id === this.catid) {
            this.catcurrent = cat;
          }
        });
      });
  }

  GotToResourceCat(el) {
    console.log(el);
    this.DashboardService.CatShare = el;
    this.catid = el._id;
    this.loadresources();
    this.router.navigate(['/dashboard-LLresources/' + this.tagid + '/' + this.formatid + '/' + this.catid + '/' + this.position]);
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

  GotToResourceTag(el) {
    console.log(el);
    this.DashboardService.TagShare = el;
    this.tagid = el._id;
    this.loadresources();
    this.router.navigate(['/dashboard-LLresources/' + this.tagid + '/' + this.formatid + '/' + this.catid + '/' + this.position]);
  }

  loadresources() {
    this.orginalcats.forEach(cat => {
      if (cat._id === this.catid) {
        this.catcurrent = cat;
      }
    });
    this.orginaltags.forEach(tag => {
      if (tag._id === this.tagid) {
        this.tagcurrent = tag;
      }
    });
    this.RcResourceService.getData('rc_resource').subscribe(
      list => {
        this.orginalresources = list as [rc_resource];
        this.resources = [];
        this.orginalresources.forEach(res => {
          if (res.tags.filter(tag => tag === this.tagid).length > 0 && res.cats.filter(cat => cat === this.catid).length > 0 && res.type === this.formatcurrent.type) {
            this.resources.push(res);
          }
        });
        this.listData = new MatTableDataSource(this.resources as rc_resource[]);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.listData.filterPredicate = (data, filter) => {
          return this.displayedColumns.some(ele => {
            return ele !== 'actions' && data[ele].toString().toLowerCase().indexOf(filter) !== -1;
          });
        };
      });
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.toString().trim().toLowerCase();
  }

  isDowloadable(el) {
    if (el.type === 'pdf' || el.type === 'image' || el.type === 'sound' || el.type === 'video') {
      if (el.typestr === '') {
        return false;
      } else { return true; }
    } else {
      return false;
    }
  }

  IsSelected(el) {
    if (el) {
      return 'accent';
    } else {
      return '';
    }
  }

}
