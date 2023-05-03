import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {DocumentService} from "../../../services/document.service";

@Component({
  selector: 'app-document-upload-form',
  templateUrl: './document-upload-form.component.html',
  styleUrls: ['./document-upload-form.component.css']
})
export class DocumentUploadFormComponent implements OnInit {
  uid?: string;
  form!: FormGroup;
  fileToUpload?: File = undefined;
  faTimes = faTimes;

  constructor(private formBuilder: FormBuilder, private documentService: DocumentService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.uid = localStorage.getItem("uid")!;
  }

  createForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      author: [''],
      publicationDate: [''],
      description: [''],
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
        console.log("Uploading file");
        this.documentService.uploadDocument(formData, this.uid!)
          .subscribe(res => {
          });
      }
    }
  }

  removeFile() {
    this.form.get('file')?.setValue(null);
    this.fileToUpload = undefined;
  }
}
