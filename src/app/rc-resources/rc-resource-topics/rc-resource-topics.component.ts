import { Component, OnInit, EventEmitter } from '@angular/core';

import { MatDialogRef } from '@angular/material';
import { RcResourceService } from 'src/app/shared/rc-resource.service';

@Component({
  selector: 'app-rc-resource-topics',
  templateUrl: './rc-resource-topics.component.html',
  styleUrls: ['./rc-resource-topics.component.css']
})
export class RcResourceTopicsComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();
  orginaltopics: any;
  // tslint:disable-next-line: no-shadowed-variable
  constructor(
    // tslint:disable-next-line: no-shadowed-variable
    public RcResourceService: RcResourceService, public dialogRef: MatDialogRef<RcResourceTopicsComponent>) { }

  ngOnInit() {
    this.BindTopics();
  }

  onSubmit($event) {
    if (this.RcResourceService.form.valid) {
      // this.RcResourceService.form.value.topics = [];
      // this.orginaltopics.filter(orginaltopic => orginaltopic.checked).forEach(topic => {
      //   this.RcResourceService.form.value.topics.push(topic._id);
      // });
      this.event.emit({ data: this.RcResourceService.form.value });
      this.dialogRef.close();
    }
  }

  onCancel() {
    this.dialogRef.close();
    this.RcResourceService.form.reset();
    this.RcResourceService.initializeFormGroup();
    // this.notificationService.success(':: Canceled successfully');
  }

  BindTopics() {
    this.orginaltopics = [
      {
        name: 'starters',
        topics: [
          { _id: '5d07c651ea4b70130fb1666b', name: 'hw1 name, hometown and weather', groupname: 'starters', checked: false },
          { _id: '5d07c698aa54c4131d5b0662', name: 'hw2 - family & age', groupname: 'starters', checked: false }
        ]
      },
      {
        name: 'academic english',
        topics: [
          { _id: '5d07c494ea4b70130fb165ed', name: 'sociology', groupname: 'academic english', checked: false },
          { _id: '5d07c477aa54c4131d5b05d8', name: 'social work degree', groupname: 'academic english', checked: false }
        ]
      }
      // ,
      // {
      //   name: 'business english',
      //   topics: [
      //   ]
      // },
      // {
      //   name: 'talking about english exams',
      //   topics: [
      //   ]
      // },
      // {
      //   name: 'international teachers',
      //   topics: [
      //   ]
      // },
      // {
      //   name: 'general english',
      //   topics: [
      //   ]
      // }
    ];
    if (this.RcResourceService.form.value.id === '') {
      this.RcResourceService.form.value.topics = [];
    }
    this.RcResourceService.form.value.topics.forEach(topic => {
      const groups = this.orginaltopics;
      this.orginaltopics.forEach(group => {
        const result = group.topics.filter(orginaltopic => orginaltopic._id === topic);
        if (result.length > 0) {
          result[0].checked = true;
        }
      });

    });
    console.log(this.orginaltopics);
  }

  onChangeTopic(event) {
    if (event.checked) {
      this.RcResourceService.form.value.topics.push(event.source.value);
    } else {
      const i = this.RcResourceService.form.value.topics.findIndex(x => x === event.source.value);
      delete this.RcResourceService.form.value.topics[i];
    }
  }

}
