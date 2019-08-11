import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { RcTagService } from 'src/app/shared/rc-tag.service';
import { rc_tag } from 'src/app/shared/rc-tag.module';
import { RcTagComponent } from '../rc-tag/rc-tag.component';
import { NotificationService } from 'src/app/shared/notification.service';
// import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-rc-tag-list',
  templateUrl: './rc-tag-list.component.html',
  styleUrls: ['./rc-tag-list.component.css']
})
export class RcTagListComponent implements OnInit {
  // tslint:disable-next-line: no-shadowed-variable
  constructor(private RcTagService: RcTagService, public dialog: MatDialog, private notificationService: NotificationService
  ) { }
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['tagtitle', 'priority', 'role', 'actions'];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  searchKey: string;

  ngOnInit() {
    this.loadtags();
  }

  loadtags() {
    this.RcTagService.getData('rc_tag').subscribe(
      list => {
        const orginals = list as [rc_tag];
        orginals.sort((a, b) => a.priority > b.priority ? -1 : 1);
        this.listData = new MatTableDataSource(orginals as rc_tag[]);
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
      this.RcTagService.form.setValue(
        {
          $key: null,
          id: el._id,
          tagtitle: el.tagtitle,
          priority: el.priority,
          role: el.role
        });
    }
    const dialogRef = this.dialog.open(RcTagComponent, {
      width: '600px',
      data: 'Add Tag'
    });
    dialogRef.componentInstance.event.subscribe((result) => {
      this.RcTagService.create('rc_tag', this.RcTagService.form.value).subscribe(
        res => {
          this.RcTagService.form.reset();
          this.RcTagService.initializeFormGroup();
          this.notificationService.success(':: Submitted successfully');
          this.loadtags();
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
    this.RcTagService.create('rc_tag', body).subscribe(
      res => {
        const resault = res as { message: string };
        this.notificationService.success(resault.message);
        this.loadtags();
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
    this.RcTagService.delete('rc_tag', body.id).subscribe(
      res => {
        const resault = res as { message: string };
        this.notificationService.success(resault.message);
        this.loadtags();
      },
      err => {
        console.log(err.error.message);
      });
  }

}
