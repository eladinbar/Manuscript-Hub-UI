import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-share-document-dialog',
  templateUrl: './share-document-dialog.component.html',
  styleUrls: ['./share-document-dialog.component.css']
})
export class ShareDocumentDialogComponent implements OnInit {
  userEmails: string[] = [];
  emailFormControl: FormControl;

  constructor(public dialogRef: MatDialogRef<ShareDocumentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  }

  ngOnInit(): void {}

  addEmail(): void {
    if (this.emailFormControl.valid && this.emailFormControl.value.trim() !== '') {
      const email: string = this.emailFormControl.value;
      if (!this.userEmails.includes(email)) {
        this.userEmails.push(email);
        this.emailFormControl.reset();
      } else {
        this.emailFormControl.setErrors({duplicate: true});
      }
    }
  }

  removeEmail(email: string): void {
    const index: number = this.userEmails.indexOf(email);
    if (index !== -1) {
      this.userEmails.splice(index, 1);
    }
  }

  cancelDialog(): void {
    this.dialogRef.close();
    this.userEmails = [];
  }
}
