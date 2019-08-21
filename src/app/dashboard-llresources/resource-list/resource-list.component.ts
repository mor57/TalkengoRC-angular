import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { RcResourceService } from 'src/app/shared/rc-resource.service';
import { rc_resource } from 'src/app/shared/rc-resource.module';
import { NotificationService } from 'src/app/shared/notification.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { RcTagService } from '../../shared/rc-tag.service';
import { RcCatService } from '../../shared/rc-cat.service';
import { DashboardService } from '../../shared/dashboard.service';
import { rc_cat } from '../../shared/rc-cat.module';
import { rc_tag } from '../../shared/rc-tag.module';
import { RcFormatService } from '../../shared/rc-format.service';
import { rc_format } from '../../shared/rc-format.module';
import { ResourceContentModalComponent } from '../resource-content-modal/resource-content-modal.component';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.css']
})
export class ResourceListComponent implements OnInit {
  userid: string;
  showFiller = false;
  levelname = 'All';
  tagid: string;
  formatid: string;
  catid: string;
  topicid: string;
  // groupname: string;
  position: any;
  ResourceTitle: string;
  orginaltags: any[];
  orginalcats: any[];
  orginalformats: rc_format[];
  orginalresources: any[];
  formatall: rc_format = { formattitle: 'All Format', role: 'LL', _id: '0', priority: 1, type: '', trashstatus: 0 };
  formatcurrent: rc_format = { formattitle: '', role: 'LL', _id: '0', priority: 1, type: '', trashstatus: 0 };
  tagcurrent: rc_tag = { tagtitle: 'All Tag', role: 'LL', _id: '', priority: 1, type: '', trashstatus: 0 };
  catcurrent: rc_cat = { cattitle: 'All Cat', role: 'LL', _id: '', priority: 1, type: '', color: '', trashstatus: 0 };
  resources: any[];
  orginallevels: any;
  orginaltopics: { name: string; topics: { _id: string; name: string; groupname: string; checked: boolean; }[]; }[];
  show = false;
  All = 'All';
  TopicTitle: string;
  // tslint:disable-next-line: no-shadowed-variable
  // tslint:disable-next-line: max-line-length
  constructor(private RcResourceService: RcResourceService, private RcFormatService: RcFormatService, private DashboardService: DashboardService, private RcTagService: RcTagService, private RcCatService: RcCatService, public dialog: MatDialog, private notificationService: NotificationService, private router: Router, private route: ActivatedRoute, public userService: UserService
  ) {
    this.userService.translateKey('RC.All').subscribe(res => {
      this.All = res;
    });
  }
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['typestr', 'resourcetitle', 'subject', 'access'];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  // @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  searchKey: string;
  apiBaseUrl: string = environment.apiBaseUrl;
  // tagcurrent: rc_tag;
  // formatcurrent: rc_format;
  // catcurrent;

  ngOnInit() {
    this.userid = this.route.snapshot.params.userid;
    this.BindLevels();
    this.orginalformats = [];
    this.tagid = this.route.snapshot.params.tagid;
    this.formatid = this.route.snapshot.params.formatid;
    this.catid = this.route.snapshot.params.catid;
    // this.groupname = this.route.snapshot.params.groupname;
    this.topicid = this.route.snapshot.params.topicid;
    if (this.topicid !== '0') {
      this.BindTopic();
    } else {
      // this.ResourceTitle = 'Resources';
      // this.userService.translateKey('RC.Resources').subscribe(res => {
      //   this.ResourceTitle = res;
      // });
    }
    this.position = this.route.snapshot.params.position;
    this.getFormat();
    this.BindTags();
    this.BindCats();
    this.loadresources();
  }

  BindTopic() {
    let topics: any;
    this.DashboardService.orginaltopics.forEach(grouptopic => {
      topics = grouptopic.topics.filter((topic) => topic._id === this.topicid);
      if (topics.length > 0) {
        this.TopicTitle = topics[0].name;
        return;
      }
    });
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
    // console.log(el);
    this.formatid = el.value;
    this.loadresources();
    // tslint:disable-next-line: max-line-length
    this.router.navigate(['/dashboard-llresources/' + this.tagid + '/' + this.formatid + '/' + this.catid + '/' + this.topicid + '/' + this.position]);
  }

  GotToResourceCat(el) {
    // console.log(el);
    this.DashboardService.CatShare = el;
    if (this.catid === el._id) {
      this.catid = '0';
    } else {
      this.catid = el._id;
    }
    this.loadresources();
    // tslint:disable-next-line: max-line-length
    this.router.navigate(['/dashboard-llresources/' + this.tagid + '/' + this.formatid + '/' + this.catid + '/' + this.topicid + '/' + this.position]);
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
    // console.log(el);
    this.DashboardService.TagShare = el;
    if (this.tagid === el._id) {
      this.tagid = '0';
    } else {
      this.tagid = el._id;
    }
    this.loadresources();
    // tslint:disable-next-line: max-line-length
    this.router.navigate(['/dashboard-llresources/' + this.tagid + '/' + this.formatid + '/' + this.catid + '/' + this.topicid + '/' + this.position]);
  }

  loadresources() {
    if (this.catid !== '0') {
      this.orginalcats.forEach(cat => {
        if (cat._id === this.catid) {
          this.catcurrent = cat;
        }
      });
    }
    if (this.tagid !== '0') {
      this.orginaltags.forEach(tag => {
        if (tag._id === this.tagid) {
          this.tagcurrent = tag;
        }
      });
    }
    if (this.formatid !== '0') {
      this.orginalformats.forEach(format => {
        if (format._id === this.formatid) {
          this.formatcurrent = format;
        }
      });
    }
    this.RcResourceService.getData('rc_resource').subscribe(
      list => {
        this.orginalresources = list as [rc_resource];
        this.orginalresources.sort((a, b) => a.priority < b.priority ? -1 : 1);
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
          if (this.topicid !== '0' && this.position !== 'rc') {
            if (this.position.toLowerCase() === 'homework' && res.access.toLowerCase() !== this.position.toLowerCase()) {
              passfilter = false;
            }
            // tslint:disable-next-line: max-line-length
            if (this.position.toLowerCase() === 'special' && ((res.access.toLowerCase() !== this.position.toLowerCase() && res.access.toLowerCase() !== 'Both in session and in resource center'.toLowerCase()))) {
              passfilter = false;
            }
            if (res.topics.filter((topic: string) => topic === this.topicid).length === 0) {
              passfilter = false;
            }
          } else {
            // tslint:disable-next-line: max-line-length
            if (res.access.toLowerCase() !== 'In resource center'.toLowerCase() && res.access.toLowerCase() !== 'Both in session and in resource center'.toLowerCase()) {
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
        // this.listData.paginator = this.paginator;
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

  getIconType(type) {
    if (type === 'pdf') {
      return 'picture_as_pdf';
    } else if (type === 'image') {
      return 'photo';
    } else if (type === 'sound') {
      return 'music_video';
    } else if (type === 'video') {
      return 'videocam';
    } else if (type === 'link') {
      return 'link';
    } else if (type === 'html') {
      return 'format_align_center';
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

  openDialog(el): void {
    if (el !== null) {
      if (el.trashstatus === undefined) { el.trashstatus = 0; }
      this.RcResourceService.form.setValue(
        {
          $key: null,
          id: el._id,
          resourcetitle: el.resourcetitle,
          type: el.type,
          typestr: el.typestr ? el.typestr : null,
          resourcefile: null,
          tags: el.tags,
          cats: el.cats,
          topics: el.topics,
          levels: el.levels,
          access: el.access,
          accesspermission: el.accesspermission,
          subject: el.subject,
          description: el.description,
          priority: el.priority,
          role: el.role,
          trashstatus: el.trashstatus,
          visitors: (el.visitors === null) ? [] : el.visitors,
          usagecount: (el.usagecount === undefined) ? 0 : el.usagecount,
          raters: (el.raters === null) ? [] : el.raters,
          rate_sum: (el.rate_sum === undefined) ? 0 : el.rate_sum,
        });
    }
    const dialogRef = this.dialog.open(ResourceContentModalComponent, {
      width: '99%',
      data: 'Resource Content',
      // disableClose: true
    });
  }

}
