import { Injectable } from '@angular/core';
import { rc_tag } from './rc-tag.module';
import { rc_format } from './rc-format.module';
import { rc_cat } from './rc-cat.module';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  TagShare: rc_tag;
  FormatShare: rc_format;
  CatShare: rc_cat;
  orginaltopics = [
    {
      name: 'General',
      topics: [
        { _id: '5d07c651ea4b70130fb1666b', name: 'hw1 name, hometown and weather', groupname: 'General', checked: false },
        { _id: '5d07c698aa54c4131d5b0662', name: 'hw2 - family & age', groupname: 'General', checked: false }
      ]
    },
    {
      name: 'academic english',
      topics: [
        { _id: '5d07c494ea4b70130fb165ed', name: 'sociology', groupname: 'Academic', checked: false },
        { _id: '5d07c477aa54c4131d5b05d8', name: 'social work degree', groupname: 'Academic', checked: false }
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
  ipAddress: { ip: string; };
  // TopicShare: { _id: '5d07c651ea4b70130fb1666b', name: 'hw1 name, hometown and weather', groupname: 'starters', checked: false };
  constructor(private http: HttpClient) { }

  getUserIp() {
    this.http.get<{ ip: string }>('https://jsonip.com')
      .subscribe(data => {
        console.log('th data', data);
        this.ipAddress = data;
      });
  }
}
