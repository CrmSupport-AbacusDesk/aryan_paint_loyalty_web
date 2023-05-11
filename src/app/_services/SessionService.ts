import { Injectable, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from './DatabaseService';
import { DialogComponent } from '../dialog/dialog.component';
import {Observable, of} from 'rxjs';


@Injectable({ providedIn: 'root' })
export class SessionStorage implements OnInit {
    users: any = {};
    nextUrl: any;
    loginUrl: any = '';
    ActivatedRoute: any;
    loading: any = false;

    constructor(private route: ActivatedRoute, private router: Router, public db: DatabaseService, public dialog: DialogComponent)  {
          this.ActivatedRoute = route; console.log(this.ActivatedRoute.snapshot._routerState);
        //   if(this.ActivatedRoute.snapshot._routerState.url == '') { this.loginUrl = 'login'; }
        //   if(this.ActivatedRoute.url.value[0].path == 'login') { this.loginUrl = ''; }
        }

        ngOnInit() {
            this.users.logged = false;
            this.users.token = '';
        }

        getSe():  Observable<any> {
            this.users = JSON.parse(localStorage.getItem('users')) || [];
            return of(this.users);
        }

        logoutSession() {
            this.users = {};
            this.users.logged = false;
            this.users.token = '';
            this.db.can_active = '';
            this.db.datauser = {};
            localStorage.removeItem('users');
        }

        setSession(data: any) {
            this.loading = true;
            this.db.auth_rqust(data, 'auth/login')
            .subscribe((data: any) => {
                if (data.token) {
                    this.users = data.user;
                    this.users.token = data.token;
                    this.users.logged = true;
                    localStorage.setItem('users', JSON.stringify(this.users) );

                    this.loading = false;
                    

                    if (this.users.logged) {

                    var home_page = '';
                    if(   this.users.access_level == 1  ){
                    // home_page = '/dashboard';
                        if(this.users.id==1)
                        {
                            home_page = '/dashboard';
                            // home_page = '/offer-list';

                        }
                        // else
                        // {
                        //     home_page='/coupon-code-list';
                        // }
                
                    } else if( this.users.access_level == 8)  
                    {
                       
                        if(this.users.dashboard==1)
                        {
                            home_page = '/dashboard';
                        }
                        else if(this.users.offer==1)
                        {
                            home_page = '/offer-list'; 
                        }
                        else if(this.users.redeem_request==1)
                        {
                            home_page = '/redeem-request-list'; 
                        }
                       
                        else if(this.users.karigar==1)
                        {
                            home_page = '/karigar-list'; 
                        }
                        // else if(this.users.karigar==1)
                        // {
                        //     home_page = '/karigar-list'; 
                        // }
                        else if(this.users.coupon_code==1)
                        {
                            home_page = '/coupon-code-list'; 
                        }
                        else if(this.users.feedback==1)
                        {
                            home_page = '/feedback-list'; 
                        }
                        else if(this.users.faq==1)
                        {
                            home_page = '/faq-questionnaire'; 
                        }
                       
                        else if(this.users.master==1)
                        {
                            home_page = '/digitallist'; 
                        } 
                        // else if(this.users.services==1)
                        // {
                        //     home_page = '/complaints-list/service'; 
                        // }      
                       
                        // else if(this.users.display==1)
                        // {
                        //     home_page = '/complaints-list/installation'; 
                        // }    

                        // else if(this.users.customer==1)
                        // {
                        //     home_page = '/customer-list'; 
                        // }  
                        // else if(this.users.plumber_meet==1)
                        // {
                        //     home_page = '/meet'; 
                        // }  
                        // else if(this.users.enquiry==1)
                        // {
                        //     home_page = '/enquiry-list'; 
                        // } 
                        // else if(this.users.survey==1)
                        // {
                        //     home_page = '/survey-list'; 
                        // } 
                      
                        // else if(this.users.master==1)
                        // {
                        //     home_page = '/main-category-list'; 
                        // } 
                        else{
                            this.dialog.alert("info","Not Allowed ","  You'r not allowed for Login!");
                            home_page = '';
                        }
                    }



                }


                    
                    else{
                    this.dialog.alert("info","Not Allowed ","  You'r not allowed for Login!");
                    home_page = '';


                    }


                    this.nextUrl = this.route.snapshot.queryParams['returnUrl'] || home_page;

                    this.router.navigate([ this.nextUrl ]);


                } else {
                    this.loading = false;

                    this.dialog.error( 'Username and Password does not exist ! please Try Again');
                    this.router.navigate([this.loginUrl]);
                }
            }, error => {
                this.loading = false;
                this.dialog.error('Something went wrong!');
                this.router.navigate([this.loginUrl]);
            });
        }
    // isValidToken(data: any) {
    //     this.db.get_rqst(data, 'is_valid_token').subscribe((data: any) => {console.log(data)});
    //     }

    }
