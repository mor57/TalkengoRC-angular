// tslint:disable-next-line: class-name
export class rc_resource {
  id: string;
  resourcetitle: string;
  type: string;
  typestr: string;
  resourcefile: File;
  tags: [{ type: string }];
  // cat: [{ type: Types.ObjectId, ref: cat }],
  // topic: [{ type: Types.ObjectId, ref: topic }],
  levels: [{ type: string }];
  access: string;
  accesspermission: string;
  subject: string;
  description: string;
  priority: number;
  role: string;
  trashstatus: number;
  visitors: [{ type: string }];
  usagecount: number;
  raters: [{ type: string }];
  // tslint:disable-next-line: variable-name
  rate_sum: number;
}


