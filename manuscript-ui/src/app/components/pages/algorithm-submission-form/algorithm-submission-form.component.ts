import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlgorithmService} from "../../../services/algorithm.service";

@Component({
  selector: 'app-algorithm-submission-form',
  templateUrl: './algorithm-submission-form.component.html',
  styleUrls: ['./algorithm-submission-form.component.css']
})
export class AlgorithmSubmissionFormComponent implements OnInit {
  uid!: string;
  form!: FormGroup;
  title?: string;
  modelType?: string;
  description?: string;
  repository?: string;
  demoFile?: File;
  invalidLink: boolean = false;

  constructor(private formBuilder: FormBuilder, private algorithmService: AlgorithmService) {
    this.createForm();
  }

  ngOnInit() {
    this.uid = localStorage.getItem("uid")!;
  }

  createForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      modelType: ['', Validators.required],
      description: ['', Validators.required],
      repository: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  onSubmit() {
    // handle form submission here
  }

  onFileSelected(event: any) {
    this.demoFile = event.target.files[0];
  }

  removeFile() {
    this.form.get('file')?.setValue(null);
    this.demoFile = undefined;
    const fileInput = document.getElementById('demoFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // reset the input element
    }
  }

  checkLinkValidity() {
    // Here you can implement any logic you need to check the validity of the repository link
    // For example, you can use a regular expression to check if the link is a valid URL
    // If the link is invalid, set the invalidLink property to true so that the form displays an error message and a red border around the Repository field
  }
}
