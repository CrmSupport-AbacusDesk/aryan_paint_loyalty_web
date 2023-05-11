import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { SystemUserAddComponent } from '../system-user-add/system-user-add.component';
import { DatabaseService } from '../_services/DatabaseService';

@Component({
  selector: 'app-system-user-list',
  templateUrl: './system-user-list.component.html',
  styleUrls: ['./system-user-list.component.scss']
})
export class SystemUserListComponent implements OnInit {

  search: any = {};
  filter: any={};
  productlist: any;
  loading_list=false;
  userlist = [];
  data:any=[];
  constructor(public alrt:MatDialog, public db:DatabaseService, public dialog:DialogComponent, ) { }

  ngOnInit() {
    this.getUserList();
  }

  editUser(val)
  {
      this.data = val;
      console.log(this.data);
      this.addUser();
  }
  
addUser() {
  const dialogRef = this.alrt.open(SystemUserAddComponent,{
      panelClass:"sideModal",
      data: {
          'data' : this.data,
          // 'mode' : string,
      }
  });
  dialogRef.afterClosed().subscribe(result => {
    console.log(result);
    this.data = {};
    this.getUserList();
  });
}

updateStatus(i,event){
  this.db.post_rqst({'checked' : event.checked, 'id' : this.userlist[i].id,'login_id':this.db.datauser.id}, 
  'master/userStatus').subscribe(d => 
    {
      this.dialog.success( 'Status Change successfully ');
      this.getUserList();
    });
}

getUserList(){
  this.loading_list=true;
  this.db.post_rqst({'filter':this.filter},"master/systemUser").subscribe(r=>{
    console.log(r);
    this.userlist=r['user']['data'];
    console.log(this.userlist);
    this.loading_list=false;
    
  });
}

deleteUser(id) {
  this.dialog.delete('User').then((result) => {
      if(result) {
          this.db.post_rqst({id:id}, 'master/userDelete')
          .subscribe(d => {
              console.log(d);
              this.getUserList();
              this.dialog.successfully();
          });
      }
  });
}

}

