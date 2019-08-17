import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { RcResourceService } from 'src/app/shared/rc-resource.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-resource-content-modal',
  templateUrl: './resource-content-modal.component.html',
  styleUrls: ['./resource-content-modal.component.css']
})
export class ResourceContentModalComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();
  resourcefile: any;
  rate: any;

  // tslint:disable-next-line: no-shadowed-variable
  // tslint:disable-next-line: max-line-length
  constructor(public RcResourceService: RcResourceService, private sanitizer: DomSanitizer, private userService: UserService, public dialogRef: MatDialogRef<ResourceContentModalComponent>) { }
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
    this.RcResourceService.updatevisitors('rc_resource', { id: this.RcResourceService.form.value.id, rate: false }).subscribe(
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
    const user = this.userService.getUserinfo();
    if (res.raters !== undefined) {
      const result = res.raters.filter(rateer => rateer === user.id);
      if (result.length > 0) {
        // tslint:disable-next-line: radix
        // this.rate = parseInt(((parseInt(res.raters.length) * 5 / parseInt(res.rate_sum)) + 1).toString());
        this.rate = Math.ceil(res.rate_sum / res.raters.length);
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
    // this.notificationService.success(':: Canceled successfully');
  }

  updateRate(value) {
    console.log(value);
    this.RcResourceService.updatevisitors('rc_resource', {
      id: this.RcResourceService.form.value.id,
      rate: true, ratevalue: value
    }).subscribe(
      // tslint:disable-next-line: no-shadowed-variable
      res => {
        console.log(res);
        // const resault = res as { message: string };
      },
      err => {
        console.log(err.error.message);
      }
    );
  }

  onRightClick() {
    return false;
  }

}

