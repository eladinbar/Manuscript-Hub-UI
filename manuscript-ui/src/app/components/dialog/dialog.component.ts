import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AnnotationModel} from "../../models/AnnotationModel";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  text?: string;
  @Output() onDelete: EventEmitter<AnnotationModel> = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data && data.text) {
      this.text = data.text;
    }
  }

  onOkClick(): void {
    this.dialogRef.close(this.text);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onDeleteClick(): void {
    this.dialogRef.close(0);
    this.onDelete.emit();
  }
}
