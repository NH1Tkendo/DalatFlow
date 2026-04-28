import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();

  constructor() {
    addIcons({ searchOutline });
  }

  onSearch(event: any) {
    const value = event.target.value;
    this.search.emit(value);
  }
}
