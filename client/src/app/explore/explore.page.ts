import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ExploreCardComponent } from './components/explore-card/explore-card.component';
import { ExploreService } from '../shared/services/explore.service';
import { tripSummary } from './models/explore.model';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonIcon,
    ExploreCardComponent,
  ],
})
export class ExplorePage implements OnInit {
  selectedTab = 'explore';

  exploreCards: tripSummary[] = [];

  constructor(private exploreService: ExploreService) {}

  ngOnInit() {
    this.exploreService.getItineraries().subscribe({
      next: (data) => {
        this.exploreCards = data;
      },
      error: (err) => {
        console.error('Failed to load itineraries', err);
      },
    });
  }
}
