import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { RcResourceService } from 'src/app/shared/rc-resource.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { UserService } from 'src/app/shared/user.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { rc_resource } from 'src/app/shared/rc-resource.module';

@Component({
  selector: 'app-resource-content-modal',
  templateUrl: './resource-content-modal.component.html',
  styleUrls: ['./resource-content-modal.component.css']
})
export class ResourceContentModalComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();
  resourcefile: any;
  rate: any;
  ratercount: any = 0;

  // tslint:disable-next-line: no-shadowed-variable
  // tslint:disable-next-line: max-line-length
  constructor(public RcResourceService: RcResourceService, private sanitizer: DomSanitizer, private userService: UserService, public dialogRef: MatDialogRef<ResourceContentModalComponent>, private notificationService: NotificationService) { }
  apiBaseUrl: string = environment.apiBaseUrl;

  ngOnInit() {
    if (this.RcResourceService.form.value.type === 'link') {
      this.resourcefile = this.sanitizer.bypassSecurityTrustResourceUrl(this.RcResourceService.form.value.typestr);
    } else if (this.RcResourceService.form.value.type === 'html') {
      this.RcResourceService.form.value.typestr = this.sanitizer.bypassSecurityTrustHtml(this.RcResourceService.form.value.typestr);
    } else {
      // tslint:disable-next-line: max-line-length
      this.resourcefile = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiBaseUrl + '/' + this.RcResourceService.form.value.typestr + '#toolbar=0');
    }
    const visited = this.userService.isResourceIdVisited(this.RcResourceService.form.value.id);
    this.RcResourceService.updatevisitors('rc_resource', { id: this.RcResourceService.form.value.id, rate: false, visited }).subscribe(
      // tslint:disable-next-line: no-shadowed-variable
      res => {
        console.log(res);
        // const resault = res as { message: string };
      },
      err => {
        console.log(err.error.message);
      }
    );
    const res = this.RcResourceService.form.value;
    // const user = this.userService.getUserinfo();
    if (res.raters !== undefined) {
      // const result = res.raters.filter(rateer => rateer === user.id);
      // if (result.length > 0) {
      // tslint:disable-next-line: radix
      // this.rate = parseInt(((parseInt(res.raters.length) * 5 / parseInt(res.rate_sum)) + 1).toString());
      this.rate = Math.ceil(res.rate_sum / res.raters.length);
      this.ratercount = res.raters.length;
      // }
    }
  }

  onCancel() {
    this.dialogRef.close();
    // this.notificationService.success(':: Canceled successfully');
  }

  updateRate(value) {
    const res = this.RcResourceService.form.value;
    const user = this.userService.getUserinfo();
    const result = res.raters.filter(rateer => rateer === user.id);
    // console.log(value);
    if (result.length > 0) {
      this.notificationService.warnnig('you did rate this resource before!');
      // this.event.emit({ data: this.RcResourceService.form.value });
      // this.dialogRef.close();
    } else {
      const visited = this.userService.isResourceIdVisited(this.RcResourceService.form.value.id);
      this.RcResourceService.updatevisitors('rc_resource', {
        id: this.RcResourceService.form.value.id,
        rate: true, ratevalue: value,
        visited
      }).subscribe(
        // tslint:disable-next-line: no-shadowed-variable
        (res1: rc_resource) => {
          this.rate = Math.ceil(res1.rate_sum / res1.raters.length);
          this.ratercount = res1.raters.length;
          this.RcResourceService.form.patchValue({ rate_sum: res1.rate_sum, raters: res1.raters });
          this.event.emit({ data: this.RcResourceService.form.value });
          // this.dialogRef.close();
          // console.log(res1);
        },
        err => {
          console.log(err.error.message);
        }
      );
    }
  }

  onRightClick() {
    return false;
  }

}

