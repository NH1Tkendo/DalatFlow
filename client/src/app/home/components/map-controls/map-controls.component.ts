import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, removeOutline, navigateOutline } from 'ionicons/icons';

@Component({
  selector: 'app-map-controls',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon],
  templateUrl: './map-controls.component.html',
  styleUrls: ['./map-controls.component.scss'],
})
export class MapControlsComponent {
  @Output() zoomIn = new EventEmitter<void>();
  @Output() zoomOut = new EventEmitter<void>();
  @Output() locateUser = new EventEmitter<void>();

  constructor() {
    addIcons({ addOutline, removeOutline, navigateOutline });
  }

  onZoomIn() {
    this.zoomIn.emit();
  }

  onZoomOut() {
    this.zoomOut.emit();
  }

  onLocateUser() {
    this.locateUser.emit();
  }
}
