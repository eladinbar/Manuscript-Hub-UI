import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {PrivacyEnum} from "../../../enums/PrivacyEnum";

@Component({
  selector: 'app-privacy-dialog',
  templateUrl: './privacy-dialog.component.html',
  styleUrls: ['./privacy-dialog.component.css']
})
export class PrivacyDialogComponent {
  selectedOption: PrivacyEnum;
  options: PrivacyEnum[];

  constructor(public dialogRef: MatDialogRef<PrivacyDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { currentPrivacy: PrivacyEnum }) {
    this.selectedOption = data.currentPrivacy;
    this.options = Object.values(PrivacyEnum);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
