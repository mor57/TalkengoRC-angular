import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { RcCatService } from 'src/app/shared/rc-cat.service';
import { rc_cat } from 'src/app/shared/rc-cat.module';
import { RcCatComponent } from '../rc-cat/rc-cat.component';
import { NotificationService } from 'src/app/shared/notification.service';
// import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-rc-cat-list',
  templateUrl: './rc-cat-list.component.html',
  styleUrls: ['./rc-cat-list.component.css']
})
export class RcCatListComponent implements OnInit {
  // tslint:disable-next-line: no-shadowed-variable
  constructor(private RcCatService: RcCatService, public dialog: MatDialog, private notificationService: NotificationService
  ) { }
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['cattitle', 'type', 'priority', 'role', 'actions'];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  searchKey: string;
  trashstatus: any = 0;

  ngOnInit() {
    this.loadcats(this.trashstatus);
  }

  loadcats(tstatus: any) {
    if (tstatus === -1) {
      this.trashstatus = 1;
    } else {
      this.trashstatus = 0;
    }
    this.RcCatService.getData('rc_cat').subscribe(
      list => {
        let orginals = list as rc_cat[];
        orginals.sort((a, b) => a.priority < b.priority ? -1 : 1);
        orginals = orginals.filter(res => res.trashstatus === this.trashstatus || res.trashstatus === undefined);
        this.listData = new MatTableDataSource(orginals as rc_cat[]);
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
      this.RcCatService.form.setValue(
        {
          $key: null,
          id: el._id,
          cattitle: el.cattitle,
          type: el.type,
          priority: el.priority,
          role: el.role
        });
    }
    const dialogRef = this.dialog.open(RcCatComponent, {
      width: '600px',
      data: 'Add Category',
      disableClose: true
    });
    dialogRef.componentInstance.event.subscribe((result) => {
      this.RcCatService.create('rc_cat', this.RcCatService.form.value).subscribe(
        res => {
          this.RcCatService.form.reset();
          this.RcCatService.initializeFormGroup();
          this.notificationService.success(':: Submitted successfully');
          this.loadcats(this.trashstatus);
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
    this.RcCatService.create('rc_cat', body).subscribe(
      res => {
        const resault = res as { message: string };
        this.notificationService.success(resault.message);
        this.loadcats(this.trashstatus);
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
    this.RcCatService.delete('rc_cat', body.id).subscribe(
      res => {
        const resault = res as { message: string };
        this.notificationService.success(resault.message);
        this.loadcats(this.trashstatus);
      },
      err => {
        console.log(err.error.message);
      });
  }

}
