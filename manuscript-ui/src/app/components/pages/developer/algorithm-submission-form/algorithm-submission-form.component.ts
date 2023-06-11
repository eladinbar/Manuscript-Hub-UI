import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlgorithmService} from "../../../../services/algorithm.service";
import {AlgorithmModel} from "../../../../models/AlgorithmModel";

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
      repository: ['', Validators.compose([Validators.required, Validators.pattern('^(http(s)?:\\/\\/)?[\\w.-]+(\\.[\\w.-]+)+(\\/\\w+)*(\\/)?(\\?.*)?$')])],
    });

    this.form.get('repository')!.valueChanges.subscribe(() => {
      this.invalidLink = this.form.get('repository')!.invalid;
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
