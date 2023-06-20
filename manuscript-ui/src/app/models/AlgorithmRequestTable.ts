import {ModelTypeEnum} from '../enums/ModelTypeEnum';
import {AlgorithmStatusEnum} from "../enums/AlgorithmStatusEnum";

export class AlgorithmRequestTable {
  public email!: string;
  public title!: string;
  public description!: string;
  public modelType!: ModelTypeEnum;
  public repository!: string;
  public status!: AlgorithmStatusEnum;
  public isLoading?: boolean = false;

  constructor(requestModel: AlgorithmRequestTable) {
    Object.assign(this, requestModel);
  }
}
