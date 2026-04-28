import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonFab,
  IonFabButton,
  NavController,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, compass, heart, person, add } from 'ionicons/icons';
import { TripStateService } from '../create-trip/services/create-trip-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonFab,
    IonFabButton,
    IonSpinner,
  ],
})
export class TabsPage implements OnInit, OnDestroy {
  isCreatingTrip = false;
  isGeneratingTrip = false;
  private genSub?: Subscription;

  constructor(
    private navCtrl: NavController,
    private tripStateService: TripStateService,
  ) {
    addIcons({ home, compass, heart, person, add });
  }

  ngOnInit() {
    this.genSub = this.tripStateService.isGenerating$.subscribe((status) => {
      this.isGeneratingTrip = status;
    });
  }

  ngOnDestroy() {
    if (this.genSub) {
      this.genSub.unsubscribe();
    }
  }

  navigateToCreateTrip() {
    this.isCreatingTrip = true;
    this.navCtrl
      .navigateForward('/create-trip')
      .then(() => {
        this.isCreatingTrip = false;
      })
      .catch(() => {
        this.isCreatingTrip = false;
      });
  }
}
