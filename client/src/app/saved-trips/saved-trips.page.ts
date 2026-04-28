import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { ExploreCardComponent } from '../explore/components/explore-card/explore-card.component';
import { ExploreService } from '../shared/services/explore.service';
import { addIcons } from 'ionicons';
import { folderOpenOutline, mapOutline } from 'ionicons/icons';

@Component({
  selector: 'app-saved-trips',
  templateUrl: './saved-trips.page.html',
  styleUrls: ['./saved-trips.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSpinner,
    IonIcon,
    ExploreCardComponent,
  ],
})
export class SavedTripsPage implements OnInit {
  savedTrips: any[] = [];
  isLoading = true;

  constructor(private exploreService: ExploreService) {
    addIcons({ folderOpenOutline, mapOutline });
  }

  ngOnInit() {
    this.exploreService.getMyItineraries().subscribe({
      next: (res) => {
        if (res && res.success && res.data) {
          this.savedTrips = res.data;
        } else {
          this.savedTrips = res;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to get my trips', err);
      },
    });
  }
}
