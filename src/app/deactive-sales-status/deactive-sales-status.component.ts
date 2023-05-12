import { Component, Inject, OnInit } from '@angular/core';

import { DatabaseService } from '../_services/DatabaseService';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';


@Component({
  selector: 'app-deactive-sales-status',
  templateUrl: './deactive-sales-status.component.html',
  styleUrls: ['./deactive-sales-status.component.scss']
})
export class DeactiveSalesStatusComponent implements OnInit {
  
  id:any;
  type:any;
  deactive:any={};
  status:any;

  constructor(public db: DatabaseService,  public dialog: DialogComponent,@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DeactiveSalesStatusComponent>) {
    console.log(data);
    this.deactive.id=data.id;
    this.deactive.type=data.type;
    this.deactive.checked=data.checked;
    this.status=data.status;

   }
 

  ngOnInit() {
  }
  deactiveStatus()
  {
      this.deactive.created_by=this.db.datauser.id;
      this.deactive.login_id=this.db.datauser.id;
      this.db.post_rqst( {'reason':this.deactive.reason, 'sales_user_id' :this.deactive.id ,'status':this.status},'karigar/sales_user_status_change')
      .subscribe( d => {
        this.dialog.success( 'Status successfully Change');
        this.dialogRef.close(true);
        console.log( d );
      });
    }
    
  

}
