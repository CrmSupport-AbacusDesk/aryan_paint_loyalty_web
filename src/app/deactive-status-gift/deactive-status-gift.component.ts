import { Component, OnInit,Inject } from '@angular/core';
import { DatabaseService } from '../_services/DatabaseService';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-deactive-status-gift',
  templateUrl: './deactive-status-gift.component.html',
  styleUrls: ['./deactive-status-gift.component.scss']
})
export class DeactiveStatusGiftComponent implements OnInit {

  id:any;
  type:any;
  deactive:any={};


  constructor(public db: DatabaseService,  public dialog: DialogComponent,@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DeactiveStatusGiftComponent>) {
    console.log(data);
    this.deactive.id=data.id;
    this.deactive.type=data.type;
    this.deactive.checked=data.checked;

   }

  ngOnInit() {
  }
  deactiveStatusGift()
  {
    this.deactive.created_by=this.db.datauser.id;
    this.deactive.login_id=this.db.datauser.id;
    this.db.post_rqst( {'deactive':this.deactive,'checked' : this.deactive.checked, 'id' :this.deactive.id ,'login_id' : this.db.datauser.id},'offer/deactiveStatusGift')
    .subscribe( d => {
      this.dialog.success( 'Status successfully Change');
      this.dialogRef.close(true);
      console.log( d );
    });
  }
}