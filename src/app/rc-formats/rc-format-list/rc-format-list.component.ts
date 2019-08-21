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
  trashstatus = 0;

  ngOnInit() {
    this.loadformats(this.trashstatus);
  }

  loadformats(tstatus: any) {
    if (tstatus === -1) {
      this.trashstatus = 1;
    } else {
      this.trashstatus = 0;
    }
    this.RcFormatService.getData('rc_format').subscribe(
      list => {
        let orginals = list as rc_format[];
        orginals.sort((a, b) => a.priority < b.priority ? -1 : 1);
        orginals = orginals.filter(res => res.trashstatus === this.trashstatus || res.trashstatus === undefined);
        this.listData = new MatTableDataSource(orginals as rc_format[]);
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
      data: 'Add Formategory',
      disableClose: true
    });
    dialogRef.componentInstance.event.subscribe((result) => {
      this.RcFormatService.create('rc_format', this.RcFormatService.form.value).subscribe(
        res => {
          this.RcFormatService.form.reset();
          this.RcFormatService.initializeFormGroup();
          this.notificationService.success(':: Submitted successfully');
          this.loadformats(this.trashstatus);
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
    this.RcFormatService.create('rc_format', body).subscribe(
      res => {
        const resault = res as { message: string };
        this.notificationService.success(resault.message);
        this.loadformats(this.trashstatus);
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
    this.RcFormatService.delete('rc_format', body.id).subscribe(
      res => {
        const resault = res as { message: string };
        this.notificationService.success(resault.message);
        this.loadformats(this.trashstatus);
      },
      err => {
        console.log(err.error.message);
      });
  }

}
