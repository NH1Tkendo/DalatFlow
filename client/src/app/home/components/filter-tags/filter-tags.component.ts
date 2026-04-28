import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterTag } from '../../models/filter-tag.model';

@Component({
  selector: 'app-filter-tags',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-tags.component.html',
  styleUrls: ['./filter-tags.component.scss'],
})
export class FilterTagsComponent {
  @Input() tags: FilterTag[] = [];
  @Output() tagsChange = new EventEmitter<FilterTag[]>();

  toggleTag(tag: FilterTag) {
    tag.selected = !tag.selected;
    this.tagsChange.emit(this.tags);
  }
}
