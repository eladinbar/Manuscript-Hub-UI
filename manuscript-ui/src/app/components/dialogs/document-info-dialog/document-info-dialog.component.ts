import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-document-info-dialog',
  templateUrl: './document-info-dialog.component.html',
  styleUrls: ['./document-info-dialog.component.css']
})
export class DocumentInfoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DocumentInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

}
