import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { RcResourceService } from 'src/app/shared/rc-resource.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-resource-content-modal',
  templateUrl: './resource-content-modal.component.html',
  styleUrls: ['./resource-content-modal.component.css']
})
export class ResourceContentModalComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();
  resourcefile: any;

  // tslint:disable-next-line: no-shadowed-variable
  constructor(public RcResourceService: RcResourceService, private sanitizer: DomSanitizer, public dialogRef: MatDialogRef<ResourceContentModalComponent>) { }
  apiBaseUrl: string = environment.apiBaseUrl;

  ngOnInit() {
    if (this.RcResourceService.form.value.type==='link') {
      this.resourcefile = this.sanitizer.bypassSecurityTrustResourceUrl(this.RcResourceService.form.value.typestr);
    } else if (this.RcResourceService.form.value.type==='html') {
      this.RcResourceService.form.value.typestr = this.sanitizer.bypassSecurityTrustHtml(this.RcResourceService.form.value.typestr);
    }
    else {
      this.resourcefile = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiBaseUrl  + '/' + this.RcResourceService.form.value.typestr + '#toolbar=0');
    }
  }

  onCancel() {
    this.dialogRef.close();
    // this.notificationService.success(':: Canceled successfully');
  }

  onRightClick() {
    return false;
  }

}

