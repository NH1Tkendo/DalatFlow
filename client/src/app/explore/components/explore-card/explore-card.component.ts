import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { personCircleOutline, calendarOutline } from 'ionicons/icons';

@Component({
  selector: 'app-explore-card',
  templateUrl: './explore-card.component.html',
  styleUrls: ['./explore-card.component.scss'],
  standalone: true,
  imports: [CommonModule, NgIf, IonCard, IonCardContent, IonIcon],
})
export class ExploreCardComponent implements OnInit {
  @Input() data: any;

  constructor(private router: Router) {
    addIcons({ personCircleOutline, calendarOutline });
  }

  ngOnInit() {}

  goToDetail() {
    if (this.data && this.data.id) {
      this.router.navigate(['/trip-detail', this.data.id]);
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Kiểm tra xem có phải hôm nay hay hôm qua không
      if (date.toDateString() === today.toDateString()) {
        return 'Hôm nay';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Hôm qua';
      }

      // Định dạng: DD/MM/YYYY HH:mm
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      return dateString;
    }
  }
}
