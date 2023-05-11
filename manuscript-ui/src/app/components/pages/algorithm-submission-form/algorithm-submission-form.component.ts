import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlgorithmService} from "../../../services/algorithm.service";
import {AlgorithmModel} from "../../../models/AlgorithmModel";

@Component({
  selector: 'app-algorithm-submission-form',
  templateUrl: './algorithm-submission-form.component.html',
  styleUrls: ['./algorithm-submission-form.component.css']
})
export class AlgorithmSubmissionFormComponent implements OnInit {
  uid!: string;
  form!: FormGroup;
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
      demoFile: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log("valid submit")
      const formData: FormData = new FormData();
      if (this.demoFile) {
        const algorithm: AlgorithmModel = new AlgorithmModel({
          uid: this.uid,
          title: this.form.value.title,
          modelType: this.form.value.modelType,
          description: this.form.value.description,
          url: this.form.value.repository,
          demoFile: this.demoFile,
        });
        console.log(algorithm);
        formData.append('algorithm', JSON.stringify(algorithm));
        console.log("Submitting algorithm");
        this.algorithmService.submitAlgorithm(formData)
          .subscribe(res => {
          });
      }
    }
  }

  onFileSelected(event: any) {
    this.demoFile = event.target.files[0];
  }

  removeFile() {
    this.form.get('demoFile')?.setValue(null);
    this.demoFile = undefined;
  }

  checkLinkValidity() {
    // Here you can implement any logic you need to check the validity of the repository link
    // For example, you can use a regular expression to check if the link is a valid URL
    // If the link is invalid, set the invalidLink property to true so that the form displays an error message and a red border around the Repository field
  }
}
