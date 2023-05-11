import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../../_services/DatabaseService';
import {DialogComponent} from '../../dialog/dialog.component';
import { MatDialog, MatDatepicker } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { MastetDateFilterModelComponent } from 'src/app/mastet-date-filter-model/mastet-date-filter-model.component';
import { SendmessageComponent } from 'src/app/master/karigar-data/sendmessage/sendmessage.component';
import { SendNotificationComponent } from 'src/app/master/karigar-data/send-notification/send-notification.component';
import { ChangeTypeModalComponent } from 'src/app/change-type-modal/change-type-modal.component';
import { DeactiveStatusComponent } from 'src/app/deactive-status/deactive-status.component';
import { DeactiveSalesStatusComponent } from 'src/app/deactive-sales-status/deactive-sales-status.component';

@Component({
    selector: 'app-dealer-list',
    templateUrl: './dealer-list.component.html',
    styleUrls: ['./dealer-list.component.scss']
})
export class DealerListComponent implements OnInit {
    
    loading_list = true;
    dealers: any = [];
    total_dealers = 0;
    dealer_all:any =0;
    
    last_page: number ;
    current_page = 1;
    search: any = '';
    filter:any = {};
    filtering : any = false;
    select_all:any=false;
    
    dealer_pending : any = 0;
    dealer_reject : any = 0;
    dealer_suspect : any = 0;
    dealer_verified : any = 0;
    
    constructor(public db: DatabaseService, public dialog: DialogComponent,public route:ActivatedRoute,public alrt:MatDialog) {
        this.route.params.subscribe(resp=>{
            this.current_page = resp.page;
            console.log("helo");
            
        });
        this.filter = this.db.get_filters();
        console.log(this.filter);
        if(this.filter.status == undefined)
        {
            this.filter.status = 'All';
        }
    }
    
    ngOnInit() {
        this.get_dealer_type();
        this.getDealerList(''); 
        this.AssignSaleUser();
    }
    
    openDatePicker(picker : MatDatepicker<Date>)
    {
        picker.open();
    }
    redirect_previous() {
        this.current_page--;
        this.getDealerList('');
    }
    redirect_next() {
        if (this.current_page < this.last_page) { this.current_page++; }
        else { this.current_page = 1; }
        this.getDealerList('');
    }
    
    set_filter(data)
    {
        this.db.set_filters(data);
    }
    current1()
    {
        this.current_page = 1;
        this.getDealerList('');
    }
    last1()
    {
        this.current_page = this.last_page;
        this.getDealerList('');
    }
    
    total_wallet_point:any = 0;
    
    getDealerList(action:any) 
    {
        console.log(this.filter);
        this.loading_list = true;
        this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
        this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
        if( this.filter.date)this.filtering = true;
        this.filter.mode = 0;
        
        if(action=='refresh')
        {
            this.select_all = false;
            let status = this.filter.status
            this.filter={}
            this.assign_arr=[];
            this.filter.status= status;
            this.current_page = 1;
        }
        
        
        this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser,user_type:"2"}, 'karigar/karigarList?page=' + this.current_page)
        .subscribe( d => {
            this.loading_list = false;
            console.log(d);            
            this.current_page = d.karigars.current_page;
            this.last_page = d.karigars.last_page;
            this.total_dealers =d.karigars.total;
            
            this.dealers = d.karigars.data;            
            this.dealer_all = d.karigar_all;
            this.dealer_pending = d.karigar_pending;
            this.dealer_reject = d.karigar_reject;
            this.dealer_suspect = d.karigar_suspect;
            this.dealer_verified = d.karigar_verified; 
            for(var i=0; i<this.dealers.length; i++){
                console.log(this.dealers[i].status);
                
                    if(this.dealers[i].status=="Active")
                    {
                        this.dealers[i].status=true;
                    }
                    else if(this.dealers[i].status=="Deactive")
                    {
                        this.dealers[i].status=false;
                    }
                }           
            for(var i=0; i<this.dealers.length; i++)
            {
                if(this.select_all)
                {
                    this.dealers[i]['checked'] = true;
                }
                this.dealers[i]['total_wallet_point'] = parseInt(this.dealers[i]['balance_point']) + parseInt(this.dealers[i]['referal_point_balance']);
            }

           
        });
    }


    updateStatus(i,event)
    {
        console.log(event);
        console.log(event.checked);
        if(event.checked == false)
        {
            console.log('false');
            
            const dialogRef = this.alrt.open(DeactiveSalesStatusComponent,{
                width: '500px',
                
                data: {
                    'id' : this.dealers[i].id,
                    'type':'offer',
                    'checked' : event.checked,
                    'status':'Deactive',
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
                if( result ){
                    // this.db.post_rqst({'checked' : event.checked, 'id' : this.offer[i].id, 'login_id':this.db.datauser.id}, 'offer/offerStatus')
                    // .subscribe(d => {
                    //   console.log(d);
                    //   this.dialog.success( 'Gift Status Change successfully ');
                    //   this.getOfferList();
                    // });
                    this.getDealerList('');
                }
                this.getDealerList('');
            });
        }
        else if(event.checked == true)
        {
            this.db.post_rqst({'checked' : event.checked, 'sales_user_id' : this.dealers[i].id,'status':'Active'}, 'karigar/sales_user_status_change')
            .subscribe(d => {
                console.log(d);
                this.dialog.success( 'Status Change successfully ');
                this.getDealerList('');
            });
        }  
    }
    
    changeType(target, id, firm, user_type):void{
       
        const dialogRef = this.alrt.open(ChangeTypeModalComponent, {
            width: '500px',
            data:{
               'number':target,
               'id':id,
               'company_name':firm,
               'user_type':user_type,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getDealerList('');
        });
    }
    
    wallet_asc = false;

    sortByWallet(){
        this.wallet_asc = !this.wallet_asc;
        if(this.wallet_asc){
            this.filter.sortBy = {
                "sorting_order": "asc"
            }
            this.getDealerList('');
        }
        else if (!this.wallet_asc){
            this.filter.sortBy = {
                "sorting_order": "desc"
            }
            this.getDealerList('');
        }
    }
    
 
    exportDealer()
    {
        this.filter.mode = 1;
        this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser,user_type:'2'}, 'karigar/exportKarigar')
        .subscribe( d => {
            document.location.href = this.db.myurl+'/app/uploads/exports/sales_Executive.csv';
            console.log(d);
        });
    }
    change_dealer_type(data)
    {
        this.db.post_rqst({ 'kar_type' : data.karigar_type, 'id' : data.id }, 'karigar/changeKarigarType')
        .subscribe(d => {
            console.log(d);
            this.dialog.success("Updated Successfully!");
            this.getDealerList('');
        });
    }
    type_list = [];
    get_dealer_type()
    {
        this.db.post_rqst({},"karigar/get_kar_type")
        .subscribe(resp=>{
            console.log(resp);
            this.type_list = resp.types;
        })
    }
    
    sales_users:any=[];
    AssignSaleUser()
    {
        this.db.get_rqst('','karigar/sales_users')
        .subscribe(d => {
            console.log(d);
            this.sales_users = d.sales_users;
        });
    }
    deleteDealer(id)
    {
        this.dialog.delete('Dealer')
        .then((result) => {
            if(result)
            {
                this.db.post_rqst({'id': id}, 'karigar/remove')
                .subscribe(d => {
                    console.log(d);
                    this.getDealerList('');
                    this.dialog.successfully();
                });
            }
        });
    }
    dealerStatus(i)
    {
        this.db.post_rqst({ 'status' : this.dealers[i].status, 'id' : this.dealers[i].id }, 'karigar/karigarStatus')
        .subscribe(d => {
            console.log(d);
            this.getDealerList('');
        });
    }
    openDatepicker(): void {
        const dialogRef = this.alrt.open(MastetDateFilterModelComponent, {
            width: '500px',
            data: {
                from:this.filter.date_from,
                to:this.filter.date_to
            }
        });
        
        dialogRef.afterClosed().subscribe(result => {
            this.filter.date_from = result.from;
            this.filter.date_to = result.to;
            this.getDealerList('');
        });
    }
    
    assign_arr:any=[]
    unassign_arr:any=[]
    select_item(event,indx)
    {        
        console.log(event);
        if(event.checked)
        {
            this.assign_arr.push(this.dealers[indx]);
            let idx = this.unassign_arr.findIndex(row => row.id == this.dealers[indx].id);
            this.unassign_arr.splice(idx,1);
        }
        else
        {
            let idx = this.assign_arr.findIndex(row => row.id == this.dealers[indx].id);
            this.assign_arr.splice(idx,1);
            this.unassign_arr.push(this.dealers[indx]);
        }
        console.log(this.assign_arr);
        console.log(this.unassign_arr);
    }
    

    
    select_all_data()
    {
        this.assign_arr = [];
        this.unassign_arr = [];
        console.log(this.select_all);
        this.dealers.forEach(element => {
            element.checked = this.select_all
        });
        console.log(this.assign_arr);
    }
    
    opensendmessage():void{
        const dialogRef = this.alrt.open(SendmessageComponent, {
            width: '500px',
            data:{
                assign_arr:this.assign_arr,
                unassign_arr:this.unassign_arr,
                filter:this.filter,
                select_all:this.select_all,
            }
        });
    }
    
    opensendnitification(user):void{
        const dialogRef = this.alrt.open(SendNotificationComponent, {
            width: '500px',
            data:{
                user_type:user,
                assign_arr:this.assign_arr,
                unassign_arr:this.unassign_arr,
                filter:this.filter,
                select_all:this.select_all,
            }
        });
    }
    convertType():void{
        console.log("convert function call");
        this.db.post_rqst({'data':this.assign_arr},'karigar/convertStatusDealer').subscribe(res=>{
            console.log(res);
            this.getDealerList('');
        })
    }
    convertType2():void{
        console.log("convert function call");
        this.db.post_rqst({'data':this.assign_arr},'karigar/convertDealerToKarigar').subscribe(res=>{
            console.log(res);
            this.getDealerList('');
        })
    }
}
