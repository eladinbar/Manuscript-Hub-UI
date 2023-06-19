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
      customExpectedInput: {value: '', disabled: true},
      customExpectedOutput: {value: '', disabled: true},
    });

    this.form.get('repository')!.valueChanges.subscribe(() => {
      this.invalidLink = this.form.get('repository')!.invalid;
    });

    this.form.get('modelType')!.valueChanges.subscribe((modelType: string) => {
      if (modelType === 'Other') {
        this.form.get('customExpectedInput')!.enable();
        this.form.get('customExpectedOutput')!.enable();
        this.form.get('customExpectedInput')!.setValidators(Validators.required);
        this.form.get('customExpectedOutput')!.setValidators(Validators.required);
      } else {
        this.form.get('customExpectedInput')!.disable();
        this.form.get('customExpectedOutput')!.disable();
        this.form.get('customExpectedInput')!.setValidators(null);
        this.form.get('customExpectedOutput')!.setValidators(null);
      }
      this.form.get('customExpectedInput')!.updateValueAndValidity();
      this.form.get('customExpectedOutput')!.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    let expectedInputOutput: string = "";
    if(this.form.value.modelType === 'Other')
      expectedInputOutput = `\n\n${this.form.value.customExpectedInput}\n${this.form.value.customExpectedOutput}`;
    if (this.form.valid) {
      const algorithmModel: AlgorithmModel = new AlgorithmModel({
        uid: this.uid,
        title: this.form.value.title,
        modelType: this.form.value.modelType,
        description: this.form.value.description + expectedInputOutput,
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
