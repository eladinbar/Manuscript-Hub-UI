import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  text?: string;

  constructor(public dialogRef: MatDialogRef<DialogComponent>) {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.dialogRef.close(this.text);
  }

}
