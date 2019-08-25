import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DashboardService } from '../shared/dashboard.service';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // tslint:disable-next-line: no-shadowed-variable
  // tslint:disable-next-line: max-line-length
  constructor(public userService: UserService, public dialog: MatDialog, private router: Router, public DashboardService: DashboardService) { }
  selectedtopicvalue: any = '5d07c651ea4b70130fb1666b';
  selectedtopic: any = 'hw1 name, hometown and weather';

  ngOnInit() {
  }

  DashboardLL() {
    this.router.navigate(['/dashboard-LLtags']);
  }

  Dashboardllsessionspecial() {
    // this.DashboardService.
    this.router.navigate(['/dashboard-llresources/0/0/0/' + this.selectedtopicvalue + '/special']);
  }

  Dashboardllsessionhomework() {
    this.router.navigate(['/dashboard-llresources/0/0/0/' + this.selectedtopicvalue + '/homework']);
  }

  onChangeTopic(event) {
    this.selectedtopicvalue = event.value;
    if (event.value === '5d07c651ea4b70130fb1666b') {
      this.selectedtopic = 'hw1 name, hometown and weather';
    } else if (event.value === '5d07c698aa54c4131d5b0662') {
      this.selectedtopic = 'hw2 - family & age';
    } else if (event.value === '5d07c494ea4b70130fb165ed') {
      this.selectedtopic = 'sociology';
    } else if (event.value === '5d07c477aa54c4131d5b05d8') {
      this.selectedtopic = 'social work degree';
    }
  }

}
