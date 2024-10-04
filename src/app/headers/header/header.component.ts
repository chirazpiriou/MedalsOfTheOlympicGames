import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  isDetailPage: boolean = false;
  private routeSubscription!: Subscription;

  constructor(public router : Router){}
  /** Navigates the user back to the home page. This method uses the Angular Router to redirect the application to the root URL ('').
   * It effectively takes the user to the main landing page of the application.*/
  GoBackHomePage():void {
    this.router.navigateByUrl('') ;
  }
  ngOnInit(): void {
    /** This subscription listens for changes in the router events to determine the current route.
     * It sets the 'isDetailPage' property to true if the current URL contains the string 'detail'.
     * This is particularly useful for controlling the visibility of the "Return" button in the user interface.
     * The button will only be displayed when the user is on a detail page, enhancing user navigation
     * by allowing them to easily return to the previous view or list.*/
    this.routeSubscription = this.router.events.subscribe(() => {
      this.isDetailPage = this.router.url.includes('detail');
    });
  }

  ngOnDestroy(): void{
    this.routeSubscription.unsubscribe();
  }


}
