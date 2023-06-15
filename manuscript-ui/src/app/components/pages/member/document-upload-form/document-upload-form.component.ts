import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {faTimes, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import {DocumentService} from "../../../../services/document.service";
import {DocumentInfoModel} from "../../../../models/DocumentInfoModel";

@Component({
  selector: 'app-document-upload-form',
  templateUrl: './document-upload-form.component.html',
  styleUrls: ['./document-upload-form.component.css']
})
export class DocumentUploadFormComponent implements OnInit {
  uid!: string;
  form!: FormGroup;
  fileToUpload?: File;
  tags: string[] = [];
  showTagExists: boolean = false;
  tagToAdd: string = '';
  faTimes: IconDefinition = faTimes;

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
      tags: [''],
      file: [null, Validators.required]
    });
  }

  addTag(event: any) {
    if (event) {
      event.preventDefault(); // Prevent form submission on Enter key press
    }

    this.tagToAdd = this.form.controls['tags'].value.trim();
    if (this.tagToAdd !== '' && !this.tags.includes(this.tagToAdd)) {
      this.tags.push(this.tagToAdd);
      this.form.controls['tags'].setValue('');
      this.showTagExists = false;
    } else if (this.tagToAdd !== '') {
      this.showTagExists = true;
      setTimeout(() => {
        this.showTagExists = false;
      }, 2500);
    }
  }

  removeTag(tag: string) {
    const index = this.tags.indexOf(tag);
    if (index !== -1) {
      this.tags.splice(index, 1);
      this.form.controls['tags'].setValue('');
    }
  }

  onImageSelected(event: any) {
    this.fileToUpload = event.target.files[0];
  }

  onSubmit() {
    if (this.form.valid) {
      const formData: FormData = new FormData();
      if (this.fileToUpload) {
        const documentInfo: DocumentInfoModel = new DocumentInfoModel({
          uid: this.uid,
          title: this.form.value.title,
          author: this.form.value.author,
          publicationDate: this.form.value.publicationDate,
          description: this.form.value.description,
          tags: this.tags
        });

        formData.append('file', this.fileToUpload, this.fileToUpload.name);
        this.documentService.uploadDocument(documentInfo, formData).subscribe();
      }
    }
  }

  removeFile() {
    this.form.get('file')?.setValue(null);
    this.fileToUpload = undefined;
  }
}
