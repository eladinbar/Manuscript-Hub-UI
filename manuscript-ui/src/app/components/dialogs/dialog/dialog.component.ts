import {Component, EventEmitter, Inject, Output, TemplateRef, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AnnotationModel} from "../../../models/AnnotationModel";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  text?: string;
  @ViewChild('confirmationDialog') confirmationDialog?: TemplateRef<any>;
  @Output() onDelete: EventEmitter<AnnotationModel> = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<DialogComponent>, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
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
    const dialogRef = this.dialog.open(this.confirmationDialog!);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close(0);
        this.onDelete.emit();
      } else
      this.dialogRef.close();
    });
  }
}
