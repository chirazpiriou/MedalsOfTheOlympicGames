import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public olympicSubscription!: Subscription
  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {

    /** By subscribing to olympicService.loadInitialData() in my app component, I ensure that data is loaded when the application starts,
     * and that the BehaviorSubject is populated with this data. Since AppComponent is the root component, this ensures that the data
     * is available to all child components that can subscribe to olympics$.*/

    this.olympicSubscription=this.olympicService.loadInitialData().subscribe();
  }

  /**ngOnDestroy is important to implement in order to prevent memory leaks and avoid the observable continuing to publish values,
   * even if no one is listening.*/
  ngOnDestroy(): void {
    this.olympicSubscription.unsubscribe();
  }
}
