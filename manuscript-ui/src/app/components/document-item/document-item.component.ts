import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AnnotationModel} from "../../models/AnnotationModel";

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.css']
})
export class DocumentItemComponent implements OnInit {
  @Input() annotation!: AnnotationModel;
  @Output() onSelectAnnotation: EventEmitter<AnnotationModel> = new EventEmitter();
  @Output() onUpdateAnnotation: EventEmitter<AnnotationModel> = new EventEmitter();
  @Output() onDeleteAnnotation: EventEmitter<AnnotationModel> = new EventEmitter();

  ngOnInit(): void {
  }

  onSelect(annotation: AnnotationModel) {
    this.onSelectAnnotation.emit(annotation);
  }
}
