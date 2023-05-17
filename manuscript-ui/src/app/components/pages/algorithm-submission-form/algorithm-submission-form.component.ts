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
  invalidLink: boolean = false;
  expectedLinesVisible: boolean = false;
  expectedInput: string = '';
  expectedOutput: string = '';

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
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const algorithmModel: AlgorithmModel = new AlgorithmModel({
        uid: this.uid,
        title: this.form.value.title,
        modelType: this.form.value.modelType,
        description: this.form.value.description,
        url: this.form.value.repository,
      });
      this.algorithmService.submitAlgorithm(algorithmModel).subscribe();
    }
  }

  checkLinkValidity() {
    // Here you can implement any logic you need to check the validity of the repository link
    // For example, you can use a regular expression to check if the link is a valid URL
    // If the link is invalid, set the invalidLink property to true so that the form displays an error message and a red border around the Repository field
  }

  showExpectedLines(): void {
    const selectedOption: HTMLOptionElement = this.getSelectedOption();
    this.expectedLinesVisible = true;
    this.expectedInput = selectedOption.getAttribute('data-expected-input') || '';
    this.expectedOutput = selectedOption.getAttribute('data-expected-output') || '';
  }

  getSelectedOption(): HTMLOptionElement {
    const selectElement: HTMLSelectElement = document.getElementById('modelType') as HTMLSelectElement;
    const selectedOptionIndex: number = selectElement.selectedIndex;
    return selectElement.options[selectedOptionIndex] as HTMLOptionElement;
  }
}
