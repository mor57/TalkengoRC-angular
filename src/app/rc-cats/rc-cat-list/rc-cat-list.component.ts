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

  ngOnInit() {
    this.loadcats();
  }

  loadcats() {
    this.RcCatService.getData('rc_cat').subscribe(
      list => {
        this.listData = new MatTableDataSource(list as rc_cat[]);
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
      data: 'Add Category'
    });
    dialogRef.componentInstance.event.subscribe((result) => {
      this.RcCatService.create('rc_cat', this.RcCatService.form.value).subscribe(
        res => {
          this.RcCatService.form.reset();
          this.RcCatService.initializeFormGroup();
          this.notificationService.success(':: Submitted successfully');
          this.loadcats();
        },
        err => {
          console.log(err.error.message);
        }
      );
    });
  }
  deleteRow(id) {
    this.RcCatService.delete('rc_cat', id).subscribe(
      res => {
        this.notificationService.success(':: Deleted successfully');
        this.loadcats();
      },
      err => {
        console.log(err.error.message);
      });
  }
}
