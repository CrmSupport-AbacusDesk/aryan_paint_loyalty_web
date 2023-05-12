import { Inject } from '@angular/core';
import { Component, Injectable, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DatabaseService } from 'src/app/_services/DatabaseService';

@Component({
  selector: 'app-contractor-satus-modal',
  templateUrl: './contractor-satus-modal.component.html',
  styleUrls: ['./contractor-satus-modal.component.scss']
})
export class ContractorSatusModalComponent implements OnInit {
  dataValue:any ={};
  conDetail:any={};
  id:any={};
  couponTransfer:any ={};
  conData1:any={};
  contractorData:any =[];
  pointValue:any ={};
  
  
  constructor( @Inject(MAT_DIALOG_DATA) public data, public db: DatabaseService, public dialog: DialogComponent, public dialogRef: MatDialog) { 
    console.log(data);
    this.dataValue = data['target'];
    this.id = data['id'];
    console.log( this.id);

    this.couponTransfer.coupon_points =  data.point
    
    if(data.type =='image'){
      this.getProduct();
    }
    
    
  }
  
  ngOnInit() {
    
    if(this.dataValue == 1){
      this.contractorDetail();
    }
    
  }
  
  contractorDetail(){
    this.db.post_rqst( {'id':this.id}, 'app_karigar/get_contractor_request_detail').subscribe( r =>
      {
        console.log(r);
        this.conDetail = r.request_detail[0];
      });
    }
    
    product_code:any =[]
    
    getpoint(point){
      this.pointValue  = point;
    }
    
    getProduct(){
      this.db.post_rqst( {}, 'app_karigar/getProduct?page=').subscribe(r=>{
        console.log(r);
        this.product_code=r['productData'];
        console.log(this.product_code);
      })
    }
    addItem()
    {
      let val=JSON.parse(JSON.stringify(this.conData1));
      console.log(val);
      if(this.conData1.product_point_group!='' && this.conData1.product_detail!='' && this.conData1.qty!='' && this.conData1.totalPoint!=''){
        this.contractorData.push(val);
      }
      console.log(this.contractorData);
      this.conData1.totalPoint='';
      this.conData1.product_point_group='';
      this.conData1.product_detail='';
      this.conData1.qty='';
      this.conData1.totalPoint ='';
      this.pointValue ='';
      
    }
    
    
    
    allPoint(event){
      console.log(event);
      this.conData1.totalPoint =  event * this.pointValue;
    }

    deleteItem(i)
    {
      this.contractorData.splice(i,1);
      this.dialog.success('Item delete successfully!');
    }
    
    numeric_Number(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
    changeStatus(form:any)
    {
      
      if(this.couponTransfer.status_type == 'Approved' && this.data.type =='image'){
        if(this.contractorData.length < 1){
          this.dialog.warning('Add at least one item');
          return
        }
        else{
          this.couponTransfer.part = this.contractorData;
        }
      }
      this.couponTransfer.id= this.id;
      this.db.post_rqst( this.couponTransfer, 'app_master/update_contractor_request')
      .subscribe( r => {
        console.log(r);
        if(r['status'] == "UPDATED"){
          this.dialog.success('Status Change Successfully');
          this.dialogRef.closeAll();
        }
      });
    }
    
    
    
  }
  