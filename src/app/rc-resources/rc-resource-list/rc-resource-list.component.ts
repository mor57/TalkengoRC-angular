import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { RcResourceService } from 'src/app/shared/rc-resource.service';
import { rc_resource } from 'src/app/shared/rc-resource.module';
import { RcResourceComponent } from '../rc-resource/rc-resource.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { environment } from 'src/environments/environment';
import { RcResourceTopicsComponent } from '../rc-resource-topics/rc-resource-topics.component';

@Component({
  selector: 'app-rc-resource-list',
  templateUrl: './rc-resource-list.component.html',
  styleUrls: ['./rc-resource-list.component.css']
})
export class RcResourceListComponent implements OnInit {
  // tslint:disable-next-line: no-shadowed-variable
  constructor(private RcResourceService: RcResourceService, public dialog: MatDialog, private notificationService: NotificationService
  ) { }
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['resourcetitle',
    'visitors.length',
    'usagecount',
    'rate_sum',
    'type', 'typestr', 'priority', 'role', 'access', 'actions'];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  searchKey: string;
  apiBaseUrl: string = environment.apiBaseUrl;
  trashstatus: any = 0;

  ngOnInit() {
    this.loadresources(this.trashstatus);
  }

  loadresources(tstatus: any) {
    if (tstatus === -1) {
      this.trashstatus = 1;
    } else {
      this.trashstatus = 0;
    }
    this.RcResourceService.getData('rc_resource').subscribe(
      list => {
        let orginals = list as rc_resource[];
        orginals.sort((a, b) => a.priority < b.priority ? -1 : 1);
        orginals = orginals.filter(res => res.trashstatus === this.trashstatus);
        this.listData = new MatTableDataSource(orginals as rc_resource[]);
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

  openDialog(el, status): void {
    if (el !== null) {
      if (el.trashstatus === undefined) { el.trashstatus = 0; }
      this.RcResourceService.form.setValue(
        {
          $key: null,
          id: (status === 'clone') ? '' : el._id,
          resourcetitle: (status === 'clone') ? '' : el.resourcetitle,
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
    const dialogRef = this.dialog.open(RcResourceComponent, {
      width: '90%',
      data: 'Add Resource',
      disableClose: true
    });
    dialogRef.componentInstance.event.subscribe((result) => {
      const body = this.RcResourceService.form.value;
      this.RcResourceService.create('rc_resource', body).subscribe(
        res => {
          this.RcResourceService.form.reset();
          this.RcResourceService.initializeFormGroup();
          this.notificationService.success(':: Submitted successfully');
          if (body.resourcefile !== null) {
            body.id = res._id;
            this.RcResourceService.uploadFile(body).subscribe(resUpload => {
              this.loadresources(this.trashstatus);
            });
          } else {
            this.loadresources(this.trashstatus);
          }
        },
        err => {
          console.log(err.error.message);
        }
      );
    });
  }

  openDialogTopics(el): void {
    if (el !== undefined) {
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
    const dialogRef = this.dialog.open(RcResourceTopicsComponent, {
      width: '60%',
      data: 'Assign topics to resource',
      disableClose: true
    });
    dialogRef.componentInstance.event.subscribe((result) => {
      const body = this.RcResourceService.form.value;
      this.RcResourceService.create('rc_resource', body).subscribe(
        res => {
          this.RcResourceService.form.reset();
          this.RcResourceService.initializeFormGroup();
          this.notificationService.success(':: Submitted successfully');
          this.loadresources(this.trashstatus);
        },
        err => {
          console.log(err.error.message);
        }
      );
    });
  }

  undodelete(el) {
    const body = el;
    body.trashstatus = 2;
    body.id = el._id;
    this.RcResourceService.create('rc_resource', body).subscribe(
      res => {
        const resault = res as { message: string };
        this.notificationService.success(resault.message);
        this.loadresources(this.trashstatus);
      },
      err => {
        console.log(err.error.message);
      }
    );
  }

  deleteRow(el) {
    const body = el;
    body.id = el._id;
    if (el.trashstatus === 1) {
      if (!confirm('This action delete item for ever! Are you sure?')) {
        return;
      }
    }
    this.RcResourceService.delete('rc_resource', body.id).subscribe(
      res => {
        const resault = res as { message: string };
        this.notificationService.success(resault.message);
        this.loadresources(this.trashstatus);
      },
      err => {
        console.log(err.error.message);
      });
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

  AssignTopicColor(access) {
    if (access === 'Both in session and in resource center') {
      return 'primary';
    }
    // else {
    //   return 'warn';
    // }
  }

  getRate(res) {
    if (res.raters !== undefined && res.rate_sum !== undefined) {
      return Math.ceil(res.rate_sum / res.raters.length);
    } else {
      return '';
    }
  }
}
