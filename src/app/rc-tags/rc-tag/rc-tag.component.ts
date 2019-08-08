import { Component, OnInit, EventEmitter, Inject } from '@angular/core';

import { MatDialogRef } from '@angular/material';

import { RcTagService } from 'src/app/shared/rc-tag.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-rc-tag',
  templateUrl: './rc-tag.component.html',
  styleUrls: ['./rc-tag.component.css']
})
export class RcTagComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line: no-shadowed-variable
  constructor(
    // tslint:disable-next-line: no-shadowed-variable
    public RcTagService: RcTagService, private notificationService: NotificationService,
    public dialogRef: MatDialogRef<RcTagComponent>
  ) { }


  ngOnInit() {
  }

  onCancel() {
    this.dialogRef.close();
    this.RcTagService.form.reset();
    this.RcTagService.initializeFormGroup();
    // this.notificationService.success(':: Canceled successfully');
  }

  onSubmit() {
    if (this.RcTagService.form.valid) {
      this.event.emit({ data: this.RcTagService.form.value });
      this.dialogRef.close();
    }
  }

}
