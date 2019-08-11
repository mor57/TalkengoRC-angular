import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DashboardService } from '../shared/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // tslint:disable-next-line: no-shadowed-variable
  constructor(public dialog: MatDialog, private router: Router, public DashboardService: DashboardService) { }

  ngOnInit() {
  }

  DashboardLL() {
    this.router.navigate(['/dashboard-LLtags']);
  }

  Dashboardllsessionspecial() {
    // this.DashboardService.
    this.router.navigate(['/dashboard-LLresources/0/0/0/general/special']);
  }

  Dashboardllsessionhomework() {
    this.router.navigate(['/dashboard-LLresources/0/0/0/general/homework']);
  }

}
