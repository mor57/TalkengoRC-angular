import { Component, OnInit, EventEmitter, Inject } from '@angular/core';

import { MatDialogRef } from '@angular/material';

import { RcFormatService } from 'src/app/shared/rc-format.service';
import { NotificationService } from 'src/app/shared/notification.service';
// import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-rc-format',
  templateUrl: './rc-format.component.html',
  styleUrls: ['./rc-format.component.css']
})
export class RcFormatComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line: no-shadowed-variable
  constructor(
    // tslint:disable-next-line: no-shadowed-variable
    public RcFormatService: RcFormatService, private notificationService: NotificationService,
    public dialogRef: MatDialogRef<RcFormatComponent>
  ) { }


  ngOnInit() {
  }

  onCancel() {
    this.dialogRef.close();
    this.RcFormatService.form.reset();
    this.RcFormatService.initializeFormGroup();
    // this.notificationService.success(':: Canceled successfully');
  }

  onSubmit() {
    if (this.RcFormatService.form.valid) {
      this.event.emit({ data: this.RcFormatService.form.value });
      this.dialogRef.close();
    }
  }

}
