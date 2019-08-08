import { Component, OnInit, EventEmitter, Inject } from '@angular/core';

import { MatDialogRef } from '@angular/material';

import { RcCatService } from 'src/app/shared/rc-cat.service';
import { NotificationService } from 'src/app/shared/notification.service';
// import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-rc-cat',
  templateUrl: './rc-cat.component.html',
  styleUrls: ['./rc-cat.component.css']
})
export class RcCatComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line: no-shadowed-variable
  constructor(
    // tslint:disable-next-line: no-shadowed-variable
    public RcCatService: RcCatService, private notificationService: NotificationService,
    public dialogRef: MatDialogRef<RcCatComponent>
  ) { }


  ngOnInit() {
  }

  onCancel() {
    this.dialogRef.close();
    this.RcCatService.form.reset();
    this.RcCatService.initializeFormGroup();
    // this.notificationService.success(':: Canceled successfully');
  }

  onSubmit() {
    if (this.RcCatService.form.valid) {
      this.event.emit({ data: this.RcCatService.form.value });
      this.dialogRef.close();
    }
  }

}
