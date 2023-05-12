import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-coupon-detail',
  templateUrl: './add-coupon-detail.component.html',
  styleUrls: ['./add-coupon-detail.component.scss']
})
export class AddCouponDetailComponent implements OnInit {

  value = 'Techiediaries';
  print_coupon: any = {};
  coupon_id: any;
  id: any;


  constructor(public db: DatabaseService,  public dialog: DialogComponent,private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      console.log(params)
      this.coupon_id =  params.couponid
      console.log(this.coupon_id);
      

    });

   }

  ngOnInit() {

     this.getPrintCoupon();
  }



  printData(): void
    {
      let printContents, popupWin;
      printContents = document.getElementById('print_card').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      
      popupWin.document.write(`
      <html>
      <head>
      <title>Print tab</title>
      <style>
      @media print {
        #qr_code_container  {
          page-break-inside: always;
          margin-bottom: 0px
        }
        @page { 
          margin: 0.07in 0.1in 0.00in;  
        }
        
        .bar-code-img, .barcode{
          
          width:105px !important;
          min-width:105px !important;
          height: 110px !important;
        }
        .barcode svg{
          width: 100%;
          height: 100%;
        }
        
        body
        {
          font-family: 'arial';
        }
        </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
        </html>`
        );
        
        popupWin.document.close();
      }





      getPrintCoupon(){
        // this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
      //  console.log("coupon list is come");
       this.db.post_rqst({'id':this.coupon_id},'app_master/coupon_details').subscribe(r=>{
         // console.log(r);
         this.print_coupon=r['coupons'];
         console.log(this.print_coupon);
       })
     }
    
}
