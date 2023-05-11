import {ModelTypeEnum} from "../enums/ModelTypeEnum";
import {AlgorithmStatusEnum} from "../enums/AlgorithmStatusEnum";

export class AlgorithmModel {
  public id?: string;
  public uid!: string;
  public title!: string;
  public modelType!: ModelTypeEnum;
  public description!: string;
  public url!: string;
  public demoFile!: File;
  public status?: AlgorithmStatusEnum = AlgorithmStatusEnum.PullRequest;

  constructor(algorithmModel: AlgorithmModel) {
    Object.assign(this, algorithmModel, {});
  }
}
