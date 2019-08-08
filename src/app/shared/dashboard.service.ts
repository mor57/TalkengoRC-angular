import { Injectable } from '@angular/core';
import { rc_tag } from './rc-tag.module';
import { rc_format } from './rc-format.module';
import { rc_cat } from './rc-cat.module';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  TagShare: rc_tag;
  FormatShare: rc_format;
  CatShare: rc_cat;
  TopicShare: { _id: '5d07c651ea4b70130fb1666b', name: 'hw1 name, hometown and weather', groupname: 'starters', checked: false };
  constructor() { }
}
