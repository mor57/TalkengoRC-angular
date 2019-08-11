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
  levelname = 'All';
  tagid: any;
  formatid: any;
  catid: any;
  groupname: string;
  position: any;
  ResourceTitle: string;
  orginaltags: any[];
  orginalcats: any[];
  orginalformats: rc_format[];
  orginalresources: any[];
  formatall: rc_format = { formattitle: 'All format', role: 'LL', _id: '0', priority: 1, type: '' };
  formatcurrent: rc_format = { formattitle: '', role: 'LL', _id: '0', priority: 1, type: '' };
  tagcurrent: rc_tag = { tagtitle: '', role: 'LL', _id: '', priority: 1, type: '' };
  catcurrent: rc_cat = { cattitle: 'All Cat', role: 'LL', _id: '', priority: 1, type: '', color: '' };
  resources: any[];
  orginallevels: any;
  orginaltopics: { name: string; topics: { _id: string; name: string; groupname: string; checked: boolean; }[]; }[];

  // tslint:disable-next-line: no-shadowed-variable
  // tslint:disable-next-line: max-line-length
  constructor(private RcResourceService: RcResourceService, private RcFormatService: RcFormatService, private DashboardService: DashboardService, private RcTagService: RcTagService, private RcCatService: RcCatService, public dialog: MatDialog, private notificationService: NotificationService, private router: Router, private route: ActivatedRoute
  ) { }
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['resourcetitle', 'type', 'priority', 'typestr', 'actions'];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  searchKey: string;
  apiBaseUrl: string = environment.apiBaseUrl;
  // tagcurrent: rc_tag;
  // formatcurrent: rc_format;
  // catcurrent;

  ngOnInit() {
    this.BindLevels();
    this.orginalformats = [];
    this.tagid = this.route.snapshot.params.tagid;
    this.formatid = this.route.snapshot.params.formatid;
    this.catid = this.route.snapshot.params.catid;
    this.groupname = this.route.snapshot.params.groupname;
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
        this.orginalformats.unshift(this.formatall);
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

  onChangeformat(el) {
    console.log(el);
    this.formatid = el.value;
    this.loadresources();
    // tslint:disable-next-line: max-line-length
    this.router.navigate(['/dashboard-LLresources/' + this.tagid + '/' + this.formatid + '/' + this.catid + '/' + this.groupname + '/' + this.position]);
  }

  GotToResourceCat(el) {
    console.log(el);
    this.DashboardService.CatShare = el;
    this.catid = el._id;
    this.loadresources();
    // tslint:disable-next-line: max-line-length
    this.router.navigate(['/dashboard-LLresources/' + this.tagid + '/' + this.formatid + '/' + this.catid + '/' + this.groupname + '/' + this.position]);
  }

  BindTags() {
    this.orginaltags = [];
    this.RcTagService.getData('rc_tag').subscribe(
      list => {
        this.orginaltags = list as [rc_tag];
        if (this.groupname !== 'all' && this.tagcurrent.tagtitle.toLowerCase() !== this.groupname.toLowerCase()) {
          this.orginaltags.forEach(tag => {
            if (tag.tagtitle.toLowerCase() === this.groupname.toLowerCase()) {
              this.GotToResourceTag(tag);
            }
          });
        } else {
          this.orginaltags.forEach(tag => {
            if (tag._id === this.tagid) {
              this.tagcurrent = tag;
            }
          });
        }
      });
  }

  GotToResourceTag(el) {
    console.log(el);
    this.DashboardService.TagShare = el;
    this.tagid = el._id;
    this.loadresources();
    // tslint:disable-next-line: max-line-length
    this.router.navigate(['/dashboard-LLresources/' + this.tagid + '/' + this.formatid + '/' + this.catid + '/' + this.groupname + '/' + this.position]);
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
    this.orginaltags.forEach(tag => {
      if (tag._id === this.tagid) {
        this.tagcurrent = tag;
      }
    });
    this.orginalformats.forEach(format => {
      if (format._id === this.formatid) {
        this.formatcurrent = format;
      }
    });
    this.RcResourceService.getData('rc_resource').subscribe(
      list => {
        this.orginalresources = list as [rc_resource];
        this.orginalresources.sort((a, b) => a.priority > b.priority ? -1 : 1);
        this.resources = [];
        this.orginalresources.forEach(res => {
          let passfilter = true;
          if (this.levelname !== 'All') {
            if (res.levels.filter((level: string) => level === this.levelname).length === 0) {
              passfilter = false;
            }
          }
          if (this.tagid !== '0') {
            if (res.tags.filter((tag: string) => tag === this.tagid).length === 0) {
              passfilter = false;
            }
          }
          if (this.catid !== '0') {
            if (res.cats.filter((cat: string) => cat === this.catid).length === 0) {
              passfilter = false;
            }
          }
          if (this.formatid !== '0') {
            if (res.type !== this.formatcurrent.type) {
              passfilter = false;
            }
          }
          if (this.groupname !== 'all' && this.position !== 'rc') {
            // tslint:disable-next-line: max-line-length
            if (res.access.toLowerCase() !== this.position.toLowerCase() && res.access.toLowerCase() !== 'Both in session and in cesource center'.toLowerCase()) {
              // tslint:disable-next-line: max-line-length
              this.orginaltopics = this.DashboardService.orginaltopics.filter(group => group.name.toLowerCase() === this.groupname.toLowerCase());
              if (this.orginaltopics.length > 0) {
                this.orginaltopics[0].topics.forEach(grouptopic => {
                  if (res.topics.filter((restopic: string) => restopic === grouptopic._id).length === 0) {
                    passfilter = false;
                  }
                });
              }
            }
          } else {
            // tslint:disable-next-line: max-line-length
            if (res.access.toLowerCase() !== 'In resource center'.toLowerCase() && res.access.toLowerCase() !== 'Both in session and in cesource center'.toLowerCase()) {
              passfilter = false;
            }
          }
          if (passfilter) {
            this.resources.push(res);
          }
          // tslint:disable-next-line: max-line-length
          // if (res.levels.filter(level => level === this.levelname).length > 0 && res.tags.filter(tag => tag === this.tagid).length > 0 && res.cats.filter(cat => cat === this.catid).length > 0 && res.type === this.formatcurrent.type) {
          //   this.resources.push(res);
          // }
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

  BindLevels() {
    this.orginallevels = [{ name: 'All', checked: false }, { name: 'Starter', checked: false }, { name: 'Level 1', checked: false },
    { name: 'Level 2', checked: false }, { name: 'Level 3', checked: false }];
    // if (this.RcResourceService.form.value.id === '') {
    //   this.RcResourceService.form.value.levels = [];
    // }
    // this.RcResourceService.form.value.levels.forEach(level => {
    //   const result = this.orginallevels.filter(orginallevel => orginallevel.name === level);
    //   if (result.length > 0) {
    //     result[0].checked = true;
    //   }
    // });
  }

  onChangeLevel(event) {
    this.levelname = event.value;
    this.loadresources();
  }

}
