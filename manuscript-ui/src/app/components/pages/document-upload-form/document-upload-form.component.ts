import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-document-upload-form',
  templateUrl: './document-upload-form.component.html',
  styleUrls: ['./document-upload-form.component.css']
})
export class DocumentUploadFormComponent implements OnInit {
  form!: FormGroup;
  fileToUpload?: File = undefined;
  faTimes = faTimes;

  constructor(private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {  }

  createForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  onImageSelected(event: any) {
    this.fileToUpload = event.target.files[0];
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('title', this.form.value.title);
      formData.append('author', this.form.value.author);
      formData.append('publicationDate', this.form.value.publicationDate);
      formData.append('description', this.form.value.description);
      if (this.fileToUpload) {
        formData.append('image', this.fileToUpload);
      }
      // Send formData to server for processing
    }
  }

  removeFile() {
    this.form.get('file')?.setValue(null);
    this.fileToUpload = undefined;
  }


  protected readonly undefined = undefined;
}
