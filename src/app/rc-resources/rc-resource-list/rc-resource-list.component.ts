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
  displayedColumns: string[] = ['resourcetitle', 'type', 'typestr', 'priority', 'role', 'actions'];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  searchKey: string;
  apiBaseUrl: string = environment.apiBaseUrl;

  ngOnInit() {
    this.loadresources();
  }

  loadresources() {
    this.RcResourceService.getData('rc_resource').subscribe(
      list => {
        this.listData = new MatTableDataSource(list as rc_resource[]);
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

  openDialog(el): void {
    if (el !== null) {
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
          role: el.role
        });
    }
    const dialogRef = this.dialog.open(RcResourceComponent, {
      width: '90%',
      data: 'Add Resource'
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
              this.loadresources();
            });
          } else {
            this.loadresources();
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
          role: el.role
        });
    }
    const dialogRef = this.dialog.open(RcResourceTopicsComponent, {
      width: '60%',
      data: 'Assign topics to resource'
    });
    dialogRef.componentInstance.event.subscribe((result) => {
      const body = this.RcResourceService.form.value;
      this.RcResourceService.create('rc_resource', body).subscribe(
        res => {
          this.RcResourceService.form.reset();
          this.RcResourceService.initializeFormGroup();
          this.notificationService.success(':: Submitted successfully');
          this.loadresources();
        },
        err => {
          console.log(err.error.message);
        }
      );
    });
  }

  deleteRow(id) {
    this.RcResourceService.delete('rc_resource', id).subscribe(
      res => {
        this.notificationService.success(':: Deleted successfully');
        this.loadresources();
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
}
