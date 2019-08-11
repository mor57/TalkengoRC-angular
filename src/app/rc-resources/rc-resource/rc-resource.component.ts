import { Component, OnInit, EventEmitter } from '@angular/core';

import { MatDialogRef } from '@angular/material';

import { RcResourceService } from 'src/app/shared/rc-resource.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { RcTagService } from 'src/app/shared/rc-tag.service';
import { RcCatService } from 'src/app/shared/rc-cat.service';
import { rc_tag } from 'src/app/shared/rc-tag.module';
import { rc_cat } from 'src/app/shared/rc-cat.module';

@Component({
  selector: 'app-rc-resource',
  templateUrl: './rc-resource.component.html',
  styleUrls: ['./rc-resource.component.css'],
})
export class RcResourceComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();
  orginallevels: any;
  orginaltags: any;
  orginalcats: any;
  tinymceOptions: any;
  islink: boolean;
  ishtml: boolean;
  hasfile: boolean;

  // tslint:disable-next-line: no-shadowed-variable
  constructor(
    // tslint:disable-next-line: no-shadowed-variable
    public RcResourceService: RcResourceService, public RcTagService: RcTagService, public RcCatService: RcCatService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<RcResourceComponent>
  ) {
    // this.tinymceOptions = {
    //   height: 380,
    //   plugins: 'print preview fullpage textcolor colorpicker image link media template codesample table charmap lists',
    //   // tslint:disable-next-line: max-line-length
    // tslint:disable-next-line: max-line-length
    //   toolbar: 'formatselect | undo redo | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lineheightselect'
    // };
  }

  ngOnInit() {
    this.onChangeType(this.RcResourceService.form.value.type);
    this.BindLevels();
    this.BindTags();
    this.BindCats();
  }

  onChangeRole() {
    this.BindTags();
    this.BindCats();
  }

  onCancel() {
    this.dialogRef.close();
    this.RcResourceService.form.reset();
    this.RcResourceService.initializeFormGroup();
    // this.notificationService.success(':: Canceled successfully');
  }

  onSubmit($event) {
    if (this.RcResourceService.form.valid) {
      if ($event.target.resourceFile.files.length > 0) {
        this.RcResourceService.form.patchValue({ resourcefile: $event.target.resourceFile.files[0] });
      }
      // this.RcResourceService.form.value.levels = [];
      // this.orginallevels.filter(orginallevel => orginallevel.checked).forEach(level => {
      //   this.RcResourceService.form.value.levels.push(level.name);
      // });
      // this.RcResourceService.form.value.tags = [];
      // this.orginaltags.filter(orginaltag => orginaltag.checked).forEach(tag => {
      //   this.RcResourceService.form.value.tags.push(tag.value);
      // });
      // this.RcResourceService.form.value.cats = [];
      // this.orginalcats.filter(orginalcat => orginalcat.checked).forEach(cat => {
      //   this.RcResourceService.form.value.cats.push(cat.value);
      // });
      this.event.emit({ data: this.RcResourceService.form.value });
      this.dialogRef.close();
    }
  }

  BindLevels() {
    this.orginallevels = [{ name: 'Starter', checked: false }, { name: 'Level 1', checked: false },
    { name: 'Level 2', checked: false }, { name: 'Level 3', checked: false }];
    if (this.RcResourceService.form.value.id === '') {
      this.RcResourceService.form.value.levels = [];
    }
    this.RcResourceService.form.value.levels.forEach(level => {
      const result = this.orginallevels.filter(orginallevel => orginallevel.name === level);
      if (result.length > 0) {
        result[0].checked = true;
      }
    });
    // console.log(this.orginallevels);
  }

  BindTags() {
    this.orginaltags = [];
    this.RcTagService.getData('rc_tag').subscribe(
      list => {
        const taglist = list as [rc_tag];
        taglist.filter(tag => tag.role === this.RcResourceService.form.value.role).forEach(tag => {
          this.orginaltags.push({ name: tag.tagtitle, value: tag._id, role: tag.role, checked: false });
        });
        if (this.RcResourceService.form.value.id === '') {
          this.RcResourceService.form.value.tags = [];
        }
        this.RcResourceService.form.value.tags.forEach(tag => {
          const result = this.orginaltags.filter(orginaltag => orginaltag.value === tag);
          if (result.length > 0) {
            result[0].checked = true;
          }
        });
        // console.log(this.orginaltags);
      });
  }

  BindCats() {
    this.orginalcats = [];
    this.RcCatService.getData('rc_cat').subscribe(
      list => {
        const catlist = list as [rc_cat];
        catlist.filter(cat => cat.role === this.RcResourceService.form.value.role).forEach(cat => {
          this.orginalcats.push({ name: cat.cattitle, value: cat._id, role: cat.role, checked: false });
        });
        if (this.RcResourceService.form.value.id === '') {
          this.RcResourceService.form.value.cats = [];
        }
        this.RcResourceService.form.value.cats.forEach(cat => {
          const result = this.orginalcats.filter(orginalcat => orginalcat.value === cat);
          if (result.length > 0) {
            result[0].checked = true;
          }
        });
        // console.log(this.orginalcats);
      });
  }

  onChangeLevel(event) {
    if (event.checked) {
      this.RcResourceService.form.value.levels.push(event.source.value);
    } else {
      const i = this.RcResourceService.form.value.levels.findIndex(x => x === event.source.value);
      delete this.RcResourceService.form.value.levels[i];
    }
  }

  onChangeTag(event) {
    if (event.checked) {
      this.RcResourceService.form.value.tags.push(event.source.value);
    } else {
      const i = this.RcResourceService.form.value.tags.findIndex(x => x === event.source.value);
      delete this.RcResourceService.form.value.tags[i];
    }
  }

  onChangeCat(event) {
    if (event.checked) {
      this.RcResourceService.form.value.cats.push(event.source.value);
    } else {
      const i = this.RcResourceService.form.value.cats.findIndex(x => x === event.source.value);
      delete this.RcResourceService.form.value.cats[i];
    }
  }

  onChangeType(type) {
    this.islink = false;
    this.ishtml = false;
    this.hasfile = false;
    if (type === 'link') {
      this.islink = true;
    } else if (type === 'html') {
      this.ishtml = true;
    } else {
      this.hasfile = true;
      if (this.RcResourceService.form.value.id === '') {
        this.RcResourceService.form.patchValue({ typestr: '' });
      }
    }
  }

}
