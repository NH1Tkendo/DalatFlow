import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore-card',
  templateUrl: './explore-card.component.html',
  styleUrls: ['./explore-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonCard, IonCardContent, IonIcon],
})
export class ExploreCardComponent implements OnInit {
  @Input() data: any;

  constructor(private router: Router) {}

  ngOnInit() {}

  goToDetail() {
    if (this.data && this.data.id) {
      this.router.navigate(['/trip-detail', this.data.id]);
    }
  }
}
