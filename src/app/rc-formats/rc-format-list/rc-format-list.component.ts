import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { RcFormatService } from 'src/app/shared/rc-format.service';
import { rc_format } from 'src/app/shared/rc-format.module';
import { RcFormatComponent } from '../rc-format/rc-format.component';
import { NotificationService } from 'src/app/shared/notification.service';
// import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-rc-format-list',
  templateUrl: './rc-format-list.component.html',
  styleUrls: ['./rc-format-list.component.css']
})
export class RcFormatListComponent implements OnInit {
  // tslint:disable-next-line: no-shadowed-variable
  constructor(private RcFormatService: RcFormatService, public dialog: MatDialog, private notificationService: NotificationService
  ) { }
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['formattitle', 'type', 'priority', 'role', 'actions'];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  searchKey: string;

  ngOnInit() {
    this.loadformats();
  }

  loadformats() {
    this.RcFormatService.getData('rc_format').subscribe(
      list => {
        this.listData = new MatTableDataSource(list as rc_format[]);
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
      this.RcFormatService.form.setValue(
        {
          $key: null,
          id: el._id,
          formattitle: el.formattitle,
          type: el.type,
          priority: el.priority,
          role: el.role
        });
    }
    const dialogRef = this.dialog.open(RcFormatComponent, {
      width: '600px',
      data: 'Add Formategory'
    });
    dialogRef.componentInstance.event.subscribe((result) => {
      this.RcFormatService.create('rc_format', this.RcFormatService.form.value).subscribe(
        res => {
          this.RcFormatService.form.reset();
          this.RcFormatService.initializeFormGroup();
          this.notificationService.success(':: Submitted successfully');
          this.loadformats();
        },
        err => {
          console.log(err.error.message);
        }
      );
    });
  }
  deleteRow(id) {
    this.RcFormatService.delete('rc_format', id).subscribe(
      res => {
        this.notificationService.success(':: Deleted successfully');
        this.loadformats();
      },
      err => {
        console.log(err.error.message);
      });
  }
}
